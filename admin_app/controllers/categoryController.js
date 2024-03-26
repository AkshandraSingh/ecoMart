const categoryModel = require('../../models/categoryModel')

module.exports = {
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
    }
}