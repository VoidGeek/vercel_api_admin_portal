const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const contactController = require("../controllers/contact.controller");

// Define the route to handle contact form submissions
router.post("/api/contacts", contactController.createContact);
router.get(
    "/api/contacts",
    contactController.getAllContacts
  );
  router.delete(
    "/api/contacts/:id",
    contactController.deleteContact
  );
module.exports = router;
