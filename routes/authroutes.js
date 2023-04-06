const {Router} = require('express');
const authcontrollers = require('../controllers/authcontrollers');




const router = Router();

router.get('/signup',authcontrollers.signup_get)

router.post('/signup',authcontrollers.signup_post)

router.get('/login', authcontrollers.login_get)

router.post('/login',authcontrollers.login_post)

module.exports = router;