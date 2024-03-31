const express = require('express')

const categoryController = require('../controllers/categoryController')

const categoryRouter = express.Router()

categoryRouter.post('/addCategory/:userId', categoryController.addCategory)
categoryRouter.patch('/updateCategory/:userId/:categoryId', categoryController.updateCategory)
categoryRouter.delete('/deleteCategory/:userId/:categoryId', categoryController.deleteCategory)
categoryRouter.get('/searchCategory/:categoryName', categoryController.searchCategory)
categoryRouter.get('/getAllCategories', categoryController.getAllCategories)
categoryRouter.get('/productsFromCategory/:categoryId', categoryController.productsFromCategory)

module.exports = categoryRouter;
