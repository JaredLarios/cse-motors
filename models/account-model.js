const pool = require("../database/")

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

async function getAccountByEmail (account_email) {
    try {
        const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
        [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

async function getAccountById(account_id) {
    try {
        const result = await pool.query(
        "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
        [account_id]
        );
        return result.rows[0];
    } catch (error) {
        return new Error("No matching email found");
    }
}

async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
    try{
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4"
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
        return result;
    } catch(error) {
        return new Error("Update failed");
    }

    }
    async function updatePassword(account_id, hashed_password) {
    try{
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2"
        const result = await pool.query(sql, [hashed_password, account_id]);
        return result;
    } catch(error) {
        return new Error("Update password failed")
    }
}

async function getAccountList() {
    const sql = "SELECT account_id, account_firstname, account_lastname FROM public.account";
    try {
        const response = await pool.query(sql);
        return response.rows;
    }
    catch(error) {
        return new Error("Failed to get account list");
    }
}

module.exports = {
    registerAccount,
    getAccountByEmail,
    getAccountById,
    updateAccount,
    updatePassword,
    getAccountList
}