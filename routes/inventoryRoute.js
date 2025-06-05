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
router.post("/edit-inventory", utilities.checkLogin, utilities.handleErrors(invController.updateInventory));

router.get("/delete-inventory/:inv_id", utilities.checkLogin, utilities.handleErrors(invController.buildDeleteInventory));
router.post("/delete-inventory", utilities.checkLogin, utilities.handleErrors(invController.deleteInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;