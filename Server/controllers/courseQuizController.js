const asyncHandler = require('express-async-handler');
const CourseQuiz = require('../models/CourseQuiz');


const getAllCourseQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await CourseQuiz.find().populate("course", ["_id", "title"]);
    if (!quizzes) {
        res.status(404).json({ message: 'No Quizzes found' });
    }
    res.json(quizzes);
});


const getCourseQuizById = async (req, res) => {
    try {
        const quiz = await CourseQuiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


const postCourseQuiz = asyncHandler(async (req, res) => {
    try {
        const quiz = new CourseQuiz(req.body);
        await quiz.save();
        res.status(201).json({ message: "Quiz added successfully", quiz });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create quiz', error: error.message });
    }
});

const updateCourseQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        let quiz = await CourseQuiz.findById(quizId);
        if (!quiz) {
            return res.status(404).send({ message: "Quiz not found" });
        }
        if (req.body.questions) {
            quiz.questions.forEach((question, index) => {
                if (req.body.questions[index]) {
                    if (req.body.questions[index].question) {
                        question.question = req.body.questions[index].question;
                    }

                    if (req.body.questions[index].answers) {
                        req.body.questions[index].answers.forEach((answer, ansIndex) => {
                            if (question.answers[ansIndex]) {

                                if (answer.text) {
                                    question.answers[ansIndex].text = answer.text;
                                }

                                if (answer.index !== undefined) {
                                    question.answers[ansIndex].index = answer.index;
                                }
                            }
                        });
                    }
                    // Update correct answer index if provided
                    if (req.body.questions[index].correctAnswerIndex !== undefined) {
                        question.correctAnswerIndex = req.body.questions[index].correctAnswerIndex;
                    }
                }
            });
        }
        if (req.body.name) {
            quiz.name = req.body.name;
        }
        if (req.body.course) {
            quiz.course = req.body.course;
        }

        quiz = await quiz.save();

        res.status(200).json({ message: "Quiz updated successfully", quiz });
    } catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const deleteCourseQuiz = async (req, res) => {
    try {
        const quiz = await CourseQuiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).send({ message: "Quiz Not Found" });
        }
        res.status(201).send({ message: "Quiz Deleted Successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

const getQuizzesByCourseId = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const quizzes = await CourseQuiz.find({ course: courseId });
        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: 'No quizzes found for this course' });
        }
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    postCourseQuiz,
    getAllCourseQuizzes,
    getCourseQuizById,
    updateCourseQuiz,
    deleteCourseQuiz,
    getQuizzesByCourseId
}