const express = require('express');
const router = express.Router();
const { postCourseQuiz, getAllCourseQuizzes, getCourseQuizById, updateCourseQuiz, deleteCourseQuiz, getQuizzesByCourseId } = require("../controllers/courseQuizController")
const { verifyTokenAccess } = require("../middlewares/verifyToken");

router.post("/", verifyTokenAccess, postCourseQuiz)
router.get("/", getAllCourseQuizzes)
router.get("/:id", getCourseQuizById)
router.get('/quizzes/:courseId', getQuizzesByCourseId);
router.put("/:id", verifyTokenAccess, updateCourseQuiz)
router.delete("/:id", verifyTokenAccess, deleteCourseQuiz)


module.exports = router