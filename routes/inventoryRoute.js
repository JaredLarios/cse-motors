const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:productId", invController.buildByProductId);

router.get("/err", invController.error500);

module.exports = router;