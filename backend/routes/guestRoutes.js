const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");
const auth = require("../middleware/auth");

router.post("/add", auth, guestController.addGuest);
router.get("/:weddingId", auth, guestController.getGuests);
router.post("/checkin", guestController.checkin);
router.delete("/:id", auth, guestController.deleteGuest);

module.exports = router;
