const router = require('express').Router();
const usersController = require('../controllers/users');
const { validateUpdateMeBody } = require('../middlewares/validate');

router.get('/me', usersController.getMe);

router.patch('/me', validateUpdateMeBody, usersController.updateMe);

module.exports = router;
