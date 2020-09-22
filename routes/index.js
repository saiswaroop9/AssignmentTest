var express = require("express");
var router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/loginuser", AuthController.login);
router.post("/registeruser", AuthController.register);
router.get("/listallproduct", AuthController.productList);
router.post("/productAdd", AuthController.productAdd);
router.post("/addtocart", AuthController.addToCart);
router.post("/cartforuser", AuthController.cartOfUser);

module.exports = router;
