const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

// USER ROUTE
router.get("/", controller.getProducts);

// ADMIN ROUTES
router.post("/", controller.addProduct);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;
