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
    }
}
