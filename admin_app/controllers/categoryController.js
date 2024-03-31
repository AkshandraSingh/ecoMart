const categoryModel = require('../../models/categoryModel')
const productModel = require('../../models/productModel')
const customerModel = require('../../models/customerModel')

module.exports = {
    //? Add Category API For Admin 👀
    addCategory: async (req, res) => {
        try {
            const { userId } = req.params
            const userData = await customerModel.findById(userId)
            if (userData.userRole !== "admin") {
                return res.status(400).send({
                    success: false,
                    message: "You are not admin!",
                })
            }
            const categoryData = new categoryModel(req.body)
            const isCategoryExist = await categoryModel.findOne({
                categoryName: req.body.categoryName
            })
            if (isCategoryExist) {
                return res.status(400).send({
                    success: false,
                    message: "Category already exist!",
                })
            }
            await categoryData.save()
            res.status(201).send({
                success: true,
                message: "Category added successfully!",
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    //? Update Category API For Admin 🎯
    updateCategory: async (req, res) => {
        try {
            const { userId, categoryId } = req.params
            const userData = await customerModel.findById(userId)
            if (userData.userRole !== "admin") {
                return res.status(400).send({
                    success: false,
                    message: "You are not admin!",
                })
            }
            const updateCategory = await categoryModel.findByIdAndUpdate(categoryId, req.body, {
                new: true
            })
            res.status(200).send({
                success: true,
                message: "Category updated successfully!",
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    //? Delete category API for Admin 🧠
    deleteCategory: async (req, res) => {
        try {
            const { categoryId, userId } = req.params
            const userData = await customerModel.findById(userId)
            if (userData.userRole !== "admin") {
                return res.status(400).send({
                    success: false,
                    message: "You are not admin!",
                })
            }
            const deleteCategory = await categoryModel.findByIdAndDelete(categoryId)
            if (!deleteCategory) {
                return res.status(400).send({
                    success: false,
                    message: "Category does not exist!",
                })
            }
            res.status(200).send({
                success: true,
                message: "Category deleted successfully!",
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    //? Get all categories API for customer/Seller 👀
    getAllCategories: async (req, res) => {
        try {
            const categories = await categoryModel.find().select("categoryName")
            res.status(200).send({
                success: true,
                message: "Categories fetched successfully!",
                allCategory: categories,
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
    //? Search category API for customer/seller 🆒
    searchCategory: async (req, res) => {
        try {
            const { categoryName } = req.params
            const searchData = await categoryModel.find({ categoryName: { $regex: `^${categoryName}`, $options: "i" } }).select('categoryName')
            if (searchData.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Category not found!"
                })
            }
            res.status(200).send({
                success: true,
                message: "Category Found",
                categoryData: searchData
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },

    //? Get all products from category API for Customer 💀
    productsFromCategory: async (req, res) => {
        try {
            const { categoryId } = req.params
            const categoryData = await categoryModel.findById(categoryId)
            const categoryName = categoryData.categoryName
            const productsData = await productModel.find({ productCategory: categoryName }).select("productName productDescription productPrice productCategory productStock productImage timesProductSold")
            res.status(200).send({
                success: true,
                message: "Products fetched successfully!",
                productsData: productsData,
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Server error!",
                error: error.message,
            })
        }
    },
}
