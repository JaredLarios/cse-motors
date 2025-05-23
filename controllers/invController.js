const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId;
        const data = await invModel.getInventoryByClassificationId(classification_id);
        const grid = await utilities.buildClassificationGrid(data);
        let nav = await utilities.getNav();
        const className = data[0].classification_name;
        return res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
        })
    } catch (err) {
        next(err);
    }
}

invCont.buildByProductId = async function (req, res, next) {
    try {
        const product_id = req.params.productId;
        const data = await invModel.getProductInformationById(product_id);
        if (!data) return next({status: 404, message: 'Sorry, we appear to have lost that page.'})
        const card = await utilities.buildProductDetail(data);
        let nav = await utilities.getNav();
        const price = Number.parseFloat(data.inv_price).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    })
        const className = data.inv_year + " " + data.inv_make + ' ' + data.inv_model

        return res.render("./inventory/detail",{
            title: className,
            price,
            nav,
            card,
        });
    } catch (err) {
        next(err);
    }
}

invCont.error500 = async function (req, res, next) {
        try {
        const product_id = req.params.productId;
        const data = await invModel.getProductInformationByIds(product_id);
        if (!data) return next({status: 404, message: 'Sorry, we appear to have lost that page.'})
        const card = await utilities.buildProductDetail(data);
        let nav = await utilities.getNav();
        const price = Number.parseFloat(data.inv_price).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    })
        const className = data.inv_year + " " + data.inv_make + ' ' + data.inv_model

        return res.render("./inventory/detail",{
            title: className,
            price,
            nav,
            card,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = invCont;