const categoryModel = require('../../models/categoryModel')

module.exports = {
    //? Add Category API For Admin 👀
    addCategory: async (req, res) => {
        try {
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
            const { categoryId } = req.params
            const isCategoryExist = await categoryModel.findOne({
                categoryId: req.params.id
            })
            if (!isCategoryExist) {
                return res.status(400).send({
                    success: false,
                    message: "Category does not exist!",
                })
            }
            const categoryData = await categoryModel.findOneAndUpdate({
                categoryId: req.params.id
            }, req.body, {
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
}