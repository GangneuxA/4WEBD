var express = require("express");
var router = express.Router();

const eventcontrollers = require("../controllers/EventControllers");

router.get("/:id/", eventcontrollers.indexOfid);

router.get("/", eventcontrollers.index);

router.post("/", eventcontrollers.insert);

router.put("/:id/", eventcontrollers.update);

router.delete("/:id/", eventcontrollers.delete);

module.exports = router;
