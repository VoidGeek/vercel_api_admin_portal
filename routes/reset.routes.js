const express = require("express");
const router = express.Router();
const resetPassController = require("../controllers/reset.controller");

router.post("/request", resetPassController.requestReset);
router.post("/verify", resetPassController.verifyOTP);
router.post("/reset", resetPassController.resetPassword);

module.exports = router;
