const Product = require("../model/products-model")
const JsonResponse = require("../model/response_model")
var log = require("../loaders/logger")
const config=require("../config/Config")

const handleAddProduct = async function (req, res, next) {
    const products = req.body;
    try {
        const productIds = [];
        for (const product of products) {
            const response = await Product.create(product);
            productIds.push(response._id);
        }
        res.status(201).json(JsonResponse.success("Products added successfully", { productIds }));
        log.info("producted added succesfully " + productIds)
    } catch (exception) {
        log.debug(exception)
        next(exception);
    }
}

const handleUpdateProduct = async function (req, res, next) {
    const productId = req.params.productId;
    const newData = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, newData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json(JsonResponse.error("Product not found"));
        }
        res.status(200).json(JsonResponse.success("Product updated successfully", { updatedProduct }));
        log.info("Product updated successfully: " + updatedProduct);
    } catch (exception) {
        log.debug(exception);
        next(exception);
    }
}

const handleDeleteProduct = async function (req, res, next) {
    const productId = req.params.productId;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json(JsonResponse.error("Product not found"));
        }

        res.status(200).json(JsonResponse.success("Product deleted successfully", { deletedProductId: productId }));
        log.info("Product deleted successfully: " + productId);
    } catch (exception) {
        log.debug(exception);
        next(exception);
    }
}

const handleGetProducts = async function (req, res, next) {

    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(JsonResponse.success("Product found successfully", products));

        log.info("Product found successfully.");
    } catch (exception) {
        log.debug(exception);
        next(exception);
    }
}


const handleGetProductById = async function (req, res, next) {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json(JsonResponse.error("Product not found"));
        }
        res.status(200).json(JsonResponse.success("Product found successfully", product));
        log.info("Product found successfully: " + product);
    } catch (exception) {
        log.debug(exception);
        next(exception);
    }
}

const handleGetProductsWithPg = async function (req, res, next) {
    var { pageNumber, pageSize, sortBy } = req.query;
     pageNumber = parseInt(pageNumber) || config.DEFAULT_PAGE_NUMBER;
    pageSize = parseInt(pageSize) || config.DEFAULT_PAGE_SIZE;
    sortBy = sortBy || 'createdAt';

    try {
        const skip = (pageNumber - 1) * pageSize;
        const products = await Product.find()
        .skip(skip)
        .limit(pageSize)
        .sort({ [sortBy]: -1 });
        res.status(200).json(JsonResponse.success("Product found successfully", products));
        log.info("Product found successfully." );

    } catch (exception) {
        log.debug(exception);
        next(exception);
    }
}

module.exports = { handleAddProduct, handleUpdateProduct, handleDeleteProduct, handleGetProducts, handleGetProductById, handleGetProductsWithPg }