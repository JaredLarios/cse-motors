const express = require("express");
const router = new express.Router();

const inboxController = require("../controllers/inboxController");
const inboxValidation = require("../utilities/inbox-validation");
const utilities = require("../utilities");

router.use(["/view/:inboxId", "/compose", "/compose/:inboxId", "/send", "/archive", "/view/:inboxId/delete", "/delete", "/view/:inboxId/toggle-read", "/view/:inboxId/toggle-archived"], utilities.checkLogin);

router.get("/", utilities.checkLogin, utilities.handleErrors(inboxController.buildInbox));

// Route to build inbox view view
router.get("/view/:inboxId", utilities.handleErrors(inboxController.buildInboxView));

// Route to build compose inbox view
router.get("/compose", utilities.handleErrors(inboxController.buildCompose));
router.get("/compose/:inboxId", utilities.handleErrors(inboxController.buildCompose));
router.post("/send", inboxValidation.sendInboxRules(), inboxValidation.checkInboxData, utilities.handleErrors(inboxController.sendInbox))

// Rout to build archived inboxs view
router.get("/archive", utilities.handleErrors(inboxController.buildArchive));

// Route to build delete inbox confirmation view
router.get("/view/:inboxId/delete", utilities.handleErrors(inboxController.buildDelete));
router.post("/delete", utilities.handleErrors(inboxController.deleteInbox));


//API calls
router.get("/view/:inboxId/toggle-read", utilities.handleErrors(inboxController.toggleRead));
router.get("/view/:inboxId/toggle-archived", utilities.handleErrors(inboxController.toggleArchived));

module.exports = router;