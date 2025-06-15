const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};


validate.sendInboxRules = () => {
    return [
        body("inbox_to")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Recipient missing")
        .isNumeric({min: 0})
        .withMessage("Please select a valid recipient"), 

        body("inbox_subject")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("inbox subject is missing or invalid"),

        body("inbox_body")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("inbox body is missing or invalid."),
    ];
};


validate.checkInboxData = async (req, res, next) => {
    const { inbox_to, inbox_subject, inbox_body } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const recipientData = await accountModel.getAccountList();
        const recipientList = utilities.buildRecipientList(
            recipientData,
            inbox_to
        );
        res.locals.Subject = inbox_subject;
        res.locals.Body = inbox_body;
        res.render("inbox/compose", {
            errors,
            title: "Compose",
            nav,
            inbox_to,
            inbox_subject,
            inbox_body,
            recipientList,
        });
        return;
    }
    next();
};

module.exports = validate;