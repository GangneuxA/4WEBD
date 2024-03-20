var express = require("express");
var router = express.Router();

const auth = require("../middleware/auth");
const buyControllers = require("../controllers/buyControllers");

router.get("/", auth, buyControllers.index);

router.post("/", auth, buyControllers.insert);

module.exports = router;
