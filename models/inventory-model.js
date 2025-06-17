const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classification_id]
        );
    return data.rows;
    } catch (error) {
        console.error("getclassificationsbyid error " + error);
    }
}

async function getProductInformationById(product_id) {
    try {
        const data = await pool.query(
            `SELECT inv_id, inv_make,
                    inv_model, inv_year,
                    inv_description, inv_image,
                    inv_thumbnail, inv_price,
                    inv_miles, inv_color, classification_name
	            FROM public.inventory inv
		        JOIN public.classification clas
                    ON inv.classification_id = clas.classification_id
	        WHERE inv_id = $1`,
            [product_id]
        );
        return data.rows[0];
    } catch (err) {
        console.error("getProductInformationById error " + error);
    }
};

async function addClassification(classification_name) {
    // ..for insertion to the database.
    const sql = `INSERT INTO public.classification (classification_name) 
        VALUES ($1)`;

    try {
        return await pool.query(sql, [classification_name]);
    } catch (error) {
        return error.message;
    }
}

async function addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    ) {
    const sql = `INSERT INTO public.inventory 
        ( inv_make,
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id)
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )`;
    try {
        return await pool.query(sql, [
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        ]);
    } catch (error) {
        new Error("editInventory error. " + error);
    }
}

async function getInventoryById(inventoryId) {
    try {
        const data = await pool.query(
        `SELECT * FROM public.inventory
            INNER JOIN public.classification
            ON public.inventory.classification_id = public.classification.classification_id
            WHERE inv_id = $1`,
        [inventoryId]
        );
        return data.rows[0];
    } catch (error) {
        new Error("getInventoryByInventoryId error" + error);
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
    ) {
    try {
        const sql =
        "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
        inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}


/* ***************************
 *  Delete Inventory Data
 * ************************** */

async function removeInventoryById(inventoryId) {
    try {
        const data = await pool.query(
        `DELETE FROM inventory WHERE  inv_id = $1`,
        [inventoryId]
        );
        return data;
    } catch (error) {
        new Error("Delete Inventory Error");
    }
}


module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getProductInformationById,
    getClassifications,
    addClassification,
    addInventory,
    getInventoryById,
    removeInventoryById,
    updateInventory
}