const express = require("express");
const router = express.Router();
const { enable, verify, disable } = require("../controllers/twoFAController"); // Correct the path to your controller

router.route("/enable").post(enable);
router.route("/verify").post(verify);
router.route("/disable").post(disable);

module.exports = router;
