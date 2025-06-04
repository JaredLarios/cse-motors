const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", utilities.handleErrors(accountController.accountLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

router.get("/", utilities.checkLogin,utilities.handleErrors(invController.buildManagementView));

module.exports = router;