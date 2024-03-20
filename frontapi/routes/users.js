var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');
const userControllers = require('../controllers/userControllers')
 
router.get('/',auth, userControllers.index);
 
router.post('/', userControllers.insert);
 
router.put('/',auth, userControllers.update);
 
router.delete('/',auth, userControllers.delete);



module.exports = router;
