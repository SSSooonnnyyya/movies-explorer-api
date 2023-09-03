const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const usersController = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserBody, validateLoginBody } = require('../middlewares/validate');
const { NotFoundError } = require('../utils/errors');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.post('/signup', validateUserBody, usersController.createUser);
router.post('/signin', validateLoginBody, usersController.login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Not found'));
});

module.exports = router;
