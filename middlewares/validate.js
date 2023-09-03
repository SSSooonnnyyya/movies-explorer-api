const {
  celebrate, Joi,
} = require('celebrate');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
});

const validateLoginBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUpdateMeBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/(http|https):\/\/(w{3}\.)?[\w-]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]+#?/).required(),
    trailerLink: Joi.string().pattern(/(http|https):\/\/(w{3}\.)?[\w-]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]+#?/).required(),
    thumbnail: Joi.string().pattern(/(http|https):\/\/(w{3}\.)?[\w-]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]+#?/).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    user_id: Joi.string().required().hex().length(24),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateUserBody,
  validateLoginBody,
  validateMovieBody,
  validateUpdateMeBody,
  validateUserId,
  validateMovieId,
};
