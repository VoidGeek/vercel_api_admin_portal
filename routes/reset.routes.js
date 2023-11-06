const express = require("express");
const router = express.Router();
const resetPassController = require("../controllers/reset.controller");

router.post("/api/request", resetPassController.requestReset);
router.post("/api/verify", resetPassController.verifyOTP);
router.post("/api/reset", resetPassController.resetPassword);

module.exports = router;
