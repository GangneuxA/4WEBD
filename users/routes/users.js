var express = require("express");
var router = express.Router();

const userControllers = require("../controllers/userControllers");

router.get("/", userControllers.index);

router.get("/:id/", userControllers.searchById);

router.post("/check/", userControllers.login);

router.post("/:email/", userControllers.searchByEmail);

router.post("/", userControllers.insert);

router.put("/:id/", userControllers.update);

router.delete("/:id/", userControllers.delete);

module.exports = router;
