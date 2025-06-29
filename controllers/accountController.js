const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const inboxModel = require('../models/inbox-model')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
require("dotenv").config()

async function buildAccountManagementView(req, res) {
    let nav = await utilities.getNav();

    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        unread: 0, 
    });
    return; 
}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()

    res.render("account/login", {
    title: "Login",
        nav,
        errors: null
    })
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
    res.clearCookie("jwt")
    delete res.locals.accountData;
    res.locals.loggedin = 0;
    req.flash("notice", "Logout successful.")
    res.redirect("/");
    return; 
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    let hashedPassword;

    try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash(
        "notice",
        "Sorry, there was an error processing the registration."
        );
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        });
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        return res.redirect("/account/")
        }
        else {
        req.flash("message notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* ****************************************
 *  Deliver account update view get
 * *************************************** */
async function buildUpdate(req, res, next) {
    let nav = await utilities.getNav();

    const accountDetails = await accountModel.getAccountById(req.params.accountId);
    const {account_id, account_firstname, account_lastname, account_email} = accountDetails;
    res.render("account/update", {
        title: "Update",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email
    });
}

/* ****************************************
 *  Process update request
 * ************************************ */
async function updateAccount(req, res) {
    let nav = await utilities.getNav();
    const {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
    } = req.body;

    const regResult = await accountModel.updateAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email,
    );

    if (regResult) {
        req.flash(
        "notice",
        `Congratulations, you've updated ${account_firstname}.`
        );

        const accountData = await accountModel.getAccountById(account_id);
        delete accountData.account_password;
        res.locals.accountData.account_firstname = accountData.account_firstname;
        utilities.updateCookie(accountData, res);

        res.status(201).render("account/management", {
        title: "Management",
        errors: null,
        unread:0,
        nav,
        });
    } else {
        req.flash("notice", "Sorry, the update failed.");
        res.status(501).render("account/update", {
        title: "Update",
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        nav,
        });
    }
}

/* ****************************************
 *  Process account password update post
 * *************************************** */
async function updatePassword(req, res) {
    let nav = await utilities.getNav();

    const { account_id, account_password } = req.body;

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash(
        "notice",
        "Sorry, there was an error processing the password update."
        );
        res.status(500).render("account/update", {
        title: "Update",
        nav,
        errors: null,
        });
    }

    const regResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (regResult) {
        req.flash(
        "notice",
        `Congratulations, you've updated the password.`
        );
        res.status(201).render("account/management", {
        title: "Manage",
        errors: null,
        unread:0,
        nav,
        });
    } else {
        req.flash("notice", "Sorry, the password update failed.");
        res.status(501).render("account/update", {
        title: "Update",
        errors: null,
        nav,
        });
    }
}


/* ****************************************
 *  Process update password request
 * ************************************ */


module.exports = {
    buildAccountManagementView,
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    accountLogout,
    buildUpdate,
    updateAccount,
    updatePassword
}