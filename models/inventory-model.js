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
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getProductInformationById
}