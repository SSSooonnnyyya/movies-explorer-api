const mongoose = require('mongoose');
const movieModel = require('../models/movie');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../utils/errors');

const getMovies = (req, res, next) => {
  movieModel
    .find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  movieModel
    .create({
      ...req.body,
      owner: req.user._id,
    })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  movieModel.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм не найден'));
      }
      if (movie.owner._id.toString() === req.user._id) {
        return movieModel.findByIdAndRemove(req.params.movieId)
          .then((dbMovie) => res.send({ movie: dbMovie }));
      }
      return next(new ForbiddenError('Нельзя удалять чужие фильмы'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Некорректный айди фильма'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
