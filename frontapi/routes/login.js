var express = require('express');
var router = express.Router();


const userControllers = require('../controllers/userControllers')
 
router.post('', userControllers.login);


module.exports = router;
