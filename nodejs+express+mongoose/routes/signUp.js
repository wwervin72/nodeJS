let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');

router.get('/', (req, res, next) => {
	res.render('signUp');
});

router.post('/', userCtrl.register);

module.exports = router;