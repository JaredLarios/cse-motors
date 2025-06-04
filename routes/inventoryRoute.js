const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities')
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:productId", invController.buildByProductId);

router.get("/err", invController.error500);


router.get("/add-classification", utilities.checkLogin, utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.checkLogin, invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification));

router.get("/add-inventory", utilities.checkLogin, utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", utilities.checkLogin, invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory));

router.get("/edit-inventory/:inv_id", utilities.checkLogin, utilities.handleErrors(invController.buildEditInventory));

module.exports = router;