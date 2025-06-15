require("dotenv").config();

const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const inboxModel = require("../models/inbox-model");


async function buildInbox(req, res, next) {
    let nav = await utilities.getNav();
    let inboxes = await inboxModel.getInboxesToId(
        res.locals.accountData.account_id
    );
    const archivedInboxes = await inboxModel.getInboxCountById(
        res.locals.accountData.account_id,
        true
    );

    let inboxTable = utilities.buildInbox(inboxes);

    res.render("inbox/mailbox", {
        title: `${res.locals.accountData.account_firstname} Inbox`,
        nav,
        errors: null,
        inboxTable,
        archived: false,
        archivedInboxes,
    });
}


async function buildArchive(req, res, next) {
    let nav = await utilities.getNav();
    let inboxes = await inboxModel.getInboxesToId(
        res.locals.accountData.account_id,
        true
    );
    const unarchivedInboxes = await inboxModel.getInboxCountById(
        res.locals.accountData.account_id,
        false
    );
    let inboxTable = utilities.buildInbox(inboxes);

    res.render("inbox/mailbox", {
        title: `${res.locals.accountData.account_firstname} Inbox: Archived Messages`,
        nav,
        errors: null,
        inboxTable,
        archived: true,
        unarchivedInboxes,
    });
}


async function buildInboxView(req, res, next) {
    const inboxId = req.params.inboxId;
    const inboxData = await inboxModel.getInboxById(inboxId);

    if (inboxData.inbox_to == res.locals.accountData.account_id) {
        const nav = await utilities.getNav();
        res.render("inbox/view", {
        title: "Message: " + inboxData.inbox_subject,
        nav,
        errors: null,
        inboxData,
        });
    } else {
        req.flash("notice", "You aren't authorized to view that message.");
        res.redirect("/inbox");
    }
}

async function buildCompose(req, res, next) {
    const nav = await utilities.getNav();
    const recipientData = await accountModel.getAccountList();
    let title = "Compose";
    let recipientList = "";

    if (req.params.inboxId) {

        const replyTo = await inboxModel.getInboxById(req.params.inboxId);
        title = `Reply to ${replyTo.account_firstname} ${replyTo.account_lastname}`;
        res.locals.Subject = "Re: " + replyTo.inbox_subject + " ";
        res.locals.Body = `\n\n\nOn ${replyTo.inbox_created.toLocaleString()} from ${
        replyTo.account_firstname
        } ${replyTo.account_lastname}:\n${replyTo.inbox_body}`;
        recipientList = utilities.buildRecipientList(
        recipientData,
        replyTo.account_id
        );
    } else {
        // Compose new path
        recipientList = utilities.buildRecipientList(recipientData);
    }

    res.render("inbox/compose", {
        title,
        nav,
        errors: null,
        recipientList,
    });
}


async function sendInbox(req, res, next) {
    const result = await inboxModel.sendInbox({
        inbox_from: res.locals.accountData.account_id,
        inbox_to: req.body.inbox_to,
        inbox_subject: req.body.inbox_subject,
        inbox_body: req.body.inbox_body,
    });

    res.redirect("/inbox");
}


async function buildDelete(req, res, next) {
    let nav = await utilities.getNav();
    const inboxData = await inboxModel.getInboxById(req.params.inboxId);

    res.render("inbox/delete", {
        title: "Confirm Deletion",
        nav,
        errors: null,
        inboxData,
    });
}


async function deleteInbox(req, res, next) {
    inboxModel.deleteInbox(req.body.inbox_id);
    req.flash("notice", "Message deleted");
    res.redirect("/inbox");
}


async function toggleRead(req, res, next) {
    const inbox_read = await inboxModel.toggleRead(req.params.inboxId);
    return res.json(inbox_read);
}


async function toggleArchived(req, res, next) {
    const inbox_read = await inboxModel.toggleArchived(req.params.inboxId);
    return res.json(inbox_read);
}

module.exports = {
    buildInbox,
    buildInboxView,
    buildCompose,
    sendInbox,
    buildArchive,
    buildDelete,
    deleteInbox,
    toggleRead,
    toggleArchived,
};