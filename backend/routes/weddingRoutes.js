const express = require("express");
const router = express.Router();
const weddingController = require("../controllers/weddingController");
const auth = require("../middleware/auth");

router.post("/", auth, weddingController.createWedding);
router.get("/", auth, weddingController.getMyWeddings);
router.get("/:id", auth, weddingController.getWedding);
router.delete("/:id", auth, weddingController.deleteWedding);
router.post("/:id/security", auth, weddingController.addSecurity);

module.exports = router;
