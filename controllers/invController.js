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

invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/management", {
        title: "Vehicle Management",
        errors: null,
        nav,
        classificationSelect,
    });
};

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();

    res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    });
};

invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body;

    const response = await invModel.addClassification(classification_name); // ...to a function within the inventory model...
    let nav = await utilities.getNav(); // After query, so it shows new classification
    if (response) {
        req.flash(
        "notice",
        `The "${classification_name}" classification was successfully added.`
        );
        res.render("inventory/management", {
        title: "Vehicle Management",
        errors: null,
        nav,
        classification_name,
        });
    } else {
        req.flash("notice", `Failed to add ${classification_name}`);
        res.render("inventory/add-classification", {
        title: "Add New Classification",
        errors: null,
        nav,
        classification_name,
        });
    }
};

invCont.buildAddInventory = async function (req, res, next) {
    const nav = await utilities.getNav();
    let classifications = await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
        title: "Add Vehicle",
        errors: null,
        nav,
        classifications,
    });
};

invCont.addInventory = async function (req, res, next) {
    const nav = await utilities.getNav();

    const {
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
    } = req.body;

    const response = await invModel.addInventory(
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
    );

    if (response) {
        req.flash(
        "notice",
        `The ${inv_year} ${inv_make} ${inv_model} successfully added.`
        );
        const classificationSelect = await utilities.buildClassificationList(classification_id);
        res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
        errors: null,
        });
    } else {
        // This seems to never get called. Is this just for DB errors?
        req.flash("notice", "There was a problem.");
        res.render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        errors: null,
        });
    }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(
        classification_id
    );
    if (invData[0].inv_id) {
        return res.json(invData);
    } else {
        next(new Error("No data returned"));
    }
};


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    res.render("./inventory/edit-inventory", {
        title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
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
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
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
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/account/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
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
        })
    }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */

invCont.buildDeleteInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)

    res.render("./inventory/delete-confirm", {
        title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
        nav,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
    })
}


invCont.deleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
    } = req.body
    const updateResult = await invModel.deleteInventory(
        inv_id,
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/account/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
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
        })
    }
}


module.exports = invCont;