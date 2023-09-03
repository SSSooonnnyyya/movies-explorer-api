const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const {
  NotFoundError,
  BadRequestError,
  ConflictRequestError,
  UnauthorisedError,
} = require('../utils/errors');
const { signToken } = require('../utils/jwtAuth');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  return bcrypt.hash(password, 10).then((hash) => {
    // Store hash in your password DB.
    userModel
      .create({
        name, email, password: hash,
      })
      .then(() => {
        res.status(201).send({
          name, email,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictRequestError('Такой пользователь уже существует'));
        } else if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError('Некорректные данные при создании пользователя'));
        } else {
          next(err);
        }
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorisedError('Email или пароль неверный');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, isEqual]) => {
      if (!isEqual) {
        next(new UnauthorisedError('Email или пароль неверный'));
        return;
      }

      const token = signToken({ _id: user._id });

      res.status(200).send({ token });
    })
    .catch(next);
};

const updateMe = (req, res, next) => userModel.findByIdAndUpdate(
  req.user._id,
  { name: req.body.name, email: req.body.email },
  { new: true, runValidators: true },
)
  .then((user) => {
    if (user) {
      res.status(200).send(user);
    } else {
      next(new NotFoundError('Пользователь не найден'));
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(err);
    }
  });

const getMe = (req, res, next) => {
  userModel
    .findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateMe,
  login,
  getMe,
};
