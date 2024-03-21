var express = require("express");
var router = express.Router();

const buyControllers = require("../controllers/buyControllers");

router.get("/", buyControllers.index);

router.get("/:id", buyControllers.findByUserId);

router.get("/event/:id", buyControllers.findByEventId);

router.post("/", buyControllers.insert);

module.exports = router;
