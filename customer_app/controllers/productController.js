const productModel = require('../../models/productModel')
const customerModel = require('../../models/customerModel')
const categoryModel = require('../../models/categoryModel')

module.exports = {
    //? Add Product API for Seller 👍🏻
    addProduct: async (req, res) => {
        try {
            const { userId } = req.params
            const productData = new productModel(req.body)
            const userData = await customerModel.findById(userId)
            const isCategoryExist = await categoryModel.findOne({
                categoryName: productData.productCategory
            })
            if (userData.userRole === "customer") {
                return res.status(400).send({
                    success: false,
                    message: "You are not a seller!",
                })
            }
            if (!isCategoryExist) {
                return res.status(400).send({
                    success: false,
                    message: "Category does not exist!",
                })
            }
            productData.userId = userId
            await productData.save()
            res.status(201).send({
                success: true,
                message: "Product is added successfully!"
            })
        } catch (error) {
            res.status(500).send({
                success: true,
                message: "Server error!",
                error: error.message,
            })
        }
    },

    //? Edit Product API for Seller 👇🏻
    editProduct: async (req, res) => {
        try {
            const productId = req.params.productId;
            const { productName, productDescription, productCategory, productPrice, productStock } = req.body;
            const productImage = req.file ? `/upload/productImages/${req.file.filename}` : undefined;
            if (productCategory) {
                const isCategoryExist = await categoryModel.findOne({
                    categoryName: productCategory
                });
                if (!isCategoryExist) {
                    return res.status(401).send({
                        success: false,
                        message: "Category Does not exist !"
                    });
                }
            }
            const editProductData = await productModel.findByIdAndUpdate(
                productId,
                {
                    productName: productName || undefined,
                    productImage: productImage || undefined,
                    productDescription: productDescription || undefined,
                    productCategory: productCategory || undefined,
                    productPrice: productPrice || undefined,
                    productStock: productStock || undefined,
                },
            );
            res.status(200).send({
                success: true,
                message: "Product Edited Successfully!",
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                error: `Error occurred: ${error.message}`,
            });
        }
    },

    //? Delete Product API for Seller 👇🏻
    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.productId;
            const deleteProductData = await productModel.findByIdAndDelete(productId);
            res.status(200).send({
                success: true,
                message: "Product Deleted Successfully!",
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                error: `Error occurred: ${error.message}`,
            });
        }
    },

    //? Search Product API for Sellers ✅
    searchProduct: async (req, res) => {
        try {
            const { productName } = req.params
            const searchData = await productModel.find({ productName: { $regex: `^${productName}`, $options: "i" } })
            if (searchData.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Product not found!"
                })
            }
            res.status(200).send({
                success: true,
                message: "Product Found",
                productData: searchData
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`,
            });
        }
    },

    //? Add to Cart API for Customer 💀
    addToCart: async (req, res) => {
        try {
            const { productId, customerId } = req.params
            const quantity = req.body.quantity
            const customerData = await customerModel.findById(customerId)
            customerData.cart.push({ productId, quantity });
            await customerData.save()
            res.status(200).json({
                success: true,
                message: "Successfully Added to Cart!",
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },

    //? View Cart API for Customer 🦕
    viewCart: async (req, res) => {
        try {
            const { customerId } = req.params;
            const customerData = await customerModel.findById(customerId);
            const cartData = [];
            for (const cartItem of customerData.cart) {
                const productData = await productModel.findById(cartItem.productId).select("productName productDescription productPrice productImage")
                cartData.push({
                    productData,
                    quantity: cartItem.quantity
                });
            }
            res.status(200).send({
                success: true,
                message: "Successfully Viewed Cart!",
                cartData: cartData
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message
            });
        }
    },

    //? Empty Cart API For Customer 🧠
    emptyCart: async (req, res) => {
        try {
            const { customerId } = req.params;
            const customerData = await customerModel.findById(customerId);
            customerData.cart = [];
            await customerData.save()
            res.status(200).send({
                success: true,
                message: "Successfully Emptied Cart!",
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message
            });
        }
    },

    //? Remove Product From Cart API For Customer 👀
    removeProductFromCart: async (req, res) => {
        try {
            const { productId, customerId } = req.params;
            const customerData = await customerModel.findById(customerId);
            const index = customerData.cart.findIndex(cartItem => cartItem.productId === productId);
            customerData.cart.splice(index, 1);
            await customerData.save()
            res.status(200).send({
                success: true,
                message: "Successfully Removed From Cart!",
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message
            });
        }
    },

    //? Decrease Quantity of Product API for Customer 🍎
    decreaseQuantity: async (req, res) => {
        try {
            const { productId, customerId } = req.params;
            const customerData = await customerModel.findById(customerId);
            const customerCart = customerData.cart
            for (let index = 0; index < customerCart.length; index++) {
                const element = customerCart[index].productId.toString()
                if (element === productId) {
                    if (customerCart[index].quantity <= 1) {
                        return res.status(400).send({
                            success: false,
                            message: "Product reached minium Quantity!",
                        });
                    }
                    customerCart[index].quantity--
                    await customerData.save()
                    return res.status(200).send({
                        success: true,
                        message: "Successfully Decreased Quantity!",
                    });
                } else {
                    return res.status(404).send({
                        success: false,
                        message: "Product not found!",
                    });
                }
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message
            });
        }
    },

    //? Increase Quantity of Product API for Customer 🍏
    increaseQuantity: async (req, res) => {
        try {
            const { productId, customerId } = req.params;
            const customerData = await customerModel.findById(customerId);
            const customerCart = customerData.cart
            for (let index = 0; index < customerCart.length; index++) {
                const element = customerCart[index].productId.toString()
                if (element === productId) {
                    customerCart[index].quantity++
                    await customerData.save()
                    return res.status(200).send({
                        success: true,
                        message: "Successfully Increased Quantity!",
                    });
                } else {
                    return res.status(404).send({
                        success: false,
                        message: "Product not found!",
                    });
                }
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message
            });
        }
    },

    //? Bill Cart API for Customer ✅
    billCart: async (req, res) => {
        try {
            let totalAmount = 0
            const { customerId } = req.params
            const customerData = await customerModel.findById(customerId)
            const customerCart = customerData.cart
            if (customerCart.length <= 0) {
                return res.status(400).send({
                    success: false,
                    message: "Cart is empty!",
                })
            }
            for (let index = 0; index < customerCart.length; index++) {
                const productRealId = customerCart[index].productId.toString()
                const productData = await productModel.findById(productRealId)
                totalAmount += productData.productPrice * customerCart[index].quantity
            }
            res.status(200).send({
                success: true,
                message: "Successfully Billed Cart!",
                totalAmount: totalAmount
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message
            });
        }
    },

    //? Order Product API for Customer 👀
    orderProduct: async (req, res) => {
        try {
            const { customerId, productId } = req.params
            const { paymentMode, quantity } = req.body
            const customerData = await customerModel.findById(customerId)
            const productData = await productModel.findById(productId)
            const sellerData = await customerModel.findById(productData.userId)
            const pricePaid = productData.productPrice * quantity
            if (pricePaid > customerData.accountBalance) {
                return res.status(400).send({
                    success: false,
                    message: "Insufficient Balance!",
                })
            }
            if (paymentMode === "cash on delivery" | paymentMode === "CASH ON DELIVERY") {
                productData.timesProductSold = productData.timesProductSold + quantity
                productData.productStock = productData.productStock - quantity
                sellerData.accountBalance += productData.productPrice * quantity
                await productData.save()
                await sellerData.save()
                return res.status(200).send({
                    success: true,
                    message: "Successfully Ordered Product!",
                })
            } else {
                productData.timesProductSold = productData.timesProductSold + quantity
                productData.productStock = productData.productStock - quantity
                sellerData.accountBalance += productData.productPrice * quantity
                customerData.accountBalance -= productData.productPrice * quantity
                await productData.save()
                await sellerData.save()
                await customerData.save()
                return res.status(200).send({
                    success: true,
                    message: "Successfully Ordered Product!",
                })
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message
            });
        }
    },
}
