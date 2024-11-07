const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById,getQuizByType, postQuiz, updateQuiz, deleteQuiz } = require("../controllers/quizController")
const { verifyTokenAnUser, verifyToken, verifyTokenAccess } = require("../middlewares/verifyToken");

router.post("/", verifyTokenAccess, postQuiz)
router.get("/", getAllQuizzes)
router.get("/:id", getQuizById)
router.get("/type/:type", getQuizByType)
router.put("/:id", verifyTokenAccess, updateQuiz)
router.delete("/:id", verifyTokenAccess, deleteQuiz)


module.exports = router