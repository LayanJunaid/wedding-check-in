const express = require("express");
const router = express.Router();

const guestController = require("../controllers/guestController");

router.post("/add", guestController.addGuest);
router.post("/checkin", guestController.checkin);

module.exports = router;
