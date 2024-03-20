var express = require("express");
var router = express.Router();

const auth = require("../middleware/auth");
const EventControllers = require("../controllers/EventControllers");

router.get("/", EventControllers.index);

router.get("/:id", EventControllers.findById);

router.post("/", auth, EventControllers.insert);

router.put("/:id", auth, EventControllers.update);

router.delete("/:id", auth, EventControllers.delete);

module.exports = router;
