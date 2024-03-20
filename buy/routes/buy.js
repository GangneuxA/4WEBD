var express = require("express");
var router = express.Router();

const buyControllers = require("../controllers/buyControllers");

router.get("/", buyControllers.index);

router.post("/", buyControllers.insert);

module.exports = router;
