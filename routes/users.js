var express = require('express');
var router = express.Router();
const {handleTokenAuthentication}=require('../middleware/jwt_authentication')

const {handleUserRegistration,handleUserLogin,handleChangePassword,handleGenerateForgotURL,handleForgotPassword,handleTokenDetails}=require("../controller/users_controller")

//middleware
router.use('/change-password',handleTokenAuthentication)
router.use('/reset-password',handleTokenAuthentication)


/* GET users listing. */
router.post('/registration',handleUserRegistration)
router.post('/login',handleUserLogin)
router.post('/generate-forgot-url',handleGenerateForgotURL)
router.post('/reset-password/:uuId',handleForgotPassword)

router.get('/token-validation',handleTokenAuthentication,handleTokenDetails)

//private API
router.post('/change-password',handleChangePassword)



module.exports = router;
