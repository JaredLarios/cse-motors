const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", utilities.handleErrors(accountController.accountLogin));
router.get("/logout", utilities.handleErrors(accountController.accountLogout));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdate));
router.post("/update", utilities.handleErrors(accountController.updateAccount));
router.post("/update-password", utilities.handleErrors(accountController.updatePassword));


module.exports = router;