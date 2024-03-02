var express = require('express');
var router = express.Router();
const {handleTokenAuthentication} =require("../middleware/jwt_authentication")
const {handleAddProduct,handleUpdateProduct,handleDeleteProduct,handleGetProducts,handleGetProductById,handleGetProductsWithPg} =require("../controller/product-controller")


//public routes
router.get('/products/',handleGetProductsWithPg)
router.get('/products/:productId',handleGetProductById)
router.get('/all-product',handleGetProducts)



// middleware
router.use('/products',handleTokenAuthentication)

/* GET home page. */
router.post('/products',handleAddProduct)
router.put('/products/:productId',handleUpdateProduct)
router.delete('/products/:productId',handleDeleteProduct)



module.exports = router;
