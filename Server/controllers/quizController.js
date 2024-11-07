const asyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz');


const getAllQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find();
    if(!quizzes){
        res.status(404).json({ message: 'No Quizzes found' });
    }
    res.json(quizzes);
});


const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getQuizByType = asyncHandler(async (req, res) => {
    const quizType = req.params.type;
    const quizzes = await Quiz.find({ type: quizType });
    if (!quizzes || quizzes.length === 0) {
        res.status(404).json({ message: `No ${quizType} Quiz found` });
    } else {
        res.json(quizzes);
    }
});

const postQuiz = asyncHandler(async (req, res) => {
    try {
        const quiz = new Quiz(req.body);
        await quiz.save();
        res.status(201).json({message:"Quiz added successfully",quiz});
    } catch (error) {
        res.status(400).json({ message: 'Failed to create quiz', error: error.message });
    }
});

const updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!quiz) {
            return res.status(404).send();
        }
        res.status(201).send({message:"Updated",quiz});
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).send({message:"Quiz Not Found"});
        }
        res.status(201).send({message:"Quiz Deleted Successfully"});
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    postQuiz,
    getAllQuizzes,
    getQuizById,
    getQuizByType,
    updateQuiz,
    deleteQuiz
}