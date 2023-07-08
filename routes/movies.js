const router = require('express').Router();
const moviesController = require('../controllers/movies');
const { validateMovieBody, validateMovieId } = require('../middlewares/validate');

router.get('/', moviesController.getMovies);

router.post('/', validateMovieBody, moviesController.createMovie);

router.delete('/:movieId', validateMovieId, moviesController.deleteMovie);

module.exports = router;
