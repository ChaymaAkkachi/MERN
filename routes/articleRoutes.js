
const express = require('express');
const router = express.Router();

const {
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getMyArticles
} = require('../controllers/articleController');

const { protect } = require('../middlewares/authMiddleware');

// Protected route: get only the articles of the logged-in user
// IMPORTANT: Declare this route before /:id
router.get('/my-articles', protect, getMyArticles);

// Public read route: get an article by its ID
router.get('/:id', getArticleById);

// Protected write operations
router.post('/', protect, createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);

module.exports = router;
