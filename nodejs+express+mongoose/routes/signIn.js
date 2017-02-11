let express = require('express');
let router = express.Router();
let userCtrl = require('../controllers/user.controlelr');

router.get('/', (req, res, next) => {
	res.render('signIn')
});

router.post('/', userCtrl.login);

module.exports = router;