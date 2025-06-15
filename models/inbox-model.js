const pool = require("../database/");


async function getInboxesToId(accountId, archived = false) {
    const sqlQuery = `
        SELECT 
            message_id, 
            message_subject, 
            message_body, 
            message_created, 
            message_to, 
            message_from, 
            message_read, 
            message_archived, 
            account_firstname, 
            account_lastname, 
            account_type
        FROM public.message JOIN public.account ON public.message.message_from = public.account.account_id
        WHERE message_to = $1 AND message_archived = $2
        ORDER BY message_created DESC`;

    try {
        return (await pool.query(sqlQuery, [accountId, archived])).rows;
    } catch (error) {
        console.error(error.message);
    }
}

async function getInboxById(accountId) {
    const sqlQuery = `
            SELECT 
                message_id, 
                message_subject, 
                message_body, 
                message_created, 
                message_to, 
                message_from, 
                message_read,
                message_archived,
                account_id,
                account_firstname,
                account_lastname,
                account_type
            FROM public.message JOIN public.account
            ON public.message.message_from = public.account.account_id
            WHERE message_id = $1`;

    try {
        return (await pool.query(sqlQuery, [accountId])).rows[0];
    } catch (error) {
        console.error(error.message);
    }
}

async function sendInbox(inboxData) {
    const sqlQuery = `
        INSERT INTO public.message (message_subject, message_body, message_to, message_from)
        VALUES ($1, $2, $3, $4);  
    `;
    try {
        const result = await pool.query(sqlQuery, [
        inboxData.inbox_subject,
        inboxData.inbox_body,
        inboxData.inbox_to,
        inboxData.inbox_from,
        ]);
        return result;
    } catch (error) {
        console.error("Failed to send message");
    }
}

async function getInboxCountById(accountId, archived = false) {
    const sqlQuery = `
            SELECT COUNT(*) 
            FROM public.message
            WHERE message_to = $1 AND message_archived = $2`;

    try {
        return (await pool.query(sqlQuery, [accountId, archived])).rows[0].count;
    } catch (error) {
        console.error("Failed to count the number of messages");
    }
}

async function toggleRead(inboxId) {
    const sqlQuery =
        "UPDATE public.message SET message_read = NOT message_read WHERE message_id = $1 RETURNING message_read";

    const result = await pool.query(sqlQuery, [inboxId]);
    return result.rows[0].inbox_read;
}

async function toggleArchived(inboxId) {
    const sqlQuery =
        "UPDATE public.message SET message_archived = NOT message_archived WHERE message_id = $1 RETURNING message_archived";
    const result = await pool.query(sqlQuery, [inboxId]);
    return result.rows[0].inbox_archived;
}

async function deleteInbox(inboxId) {
    const sqlQuery = "DELETE FROM public.message WHERE message_id = $1";
    try {
        const result = await pool.query(sqlQuery, [inboxId]);
        return result;
    } catch (error) {
        console.error("Failed to delete message " + inboxId + "\n" + error);
    }
}

module.exports = {
    getInboxesToId,
    getInboxById,
    sendInbox,
    getInboxCountById,
    toggleRead,
    toggleArchived,
    deleteInbox,
};