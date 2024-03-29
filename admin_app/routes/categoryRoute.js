const express = require('express')

const categoryController = require('../controllers/categoryController')

const categoryRouter = express.Router()

categoryRouter.post('/addCategory', categoryController.addCategory)
categoryRouter.patch('/updateCategory/:categoryId', categoryController.updateCategory)
categoryRouter.delete('/deleteCategory/:categoryId', categoryController.deleteCategory)
categoryRouter.get('/searchCategory/:categoryName', categoryController.searchCategory)
categoryRouter.get('/getAllCategories', categoryController.getAllCategories)

module.exports = categoryRouter;
