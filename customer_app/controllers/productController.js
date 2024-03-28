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
    }
}