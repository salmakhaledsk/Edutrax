//name,questions: [{qus:s , ans:[s] ,index:n }]
//courseQuiz:name,questions: [{qus:s , ans:[s] ,index:n }],course:ref:""
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        answers: [{
            text: {
                type: String,
                required: true
            },
            index: {
                type: Number,
                required: false,
            }
        }],
        correctAnswerIndex: {
            type: Number, // Store the index of the correct answer in the answers array
            required: true
        }
    }],
    course:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
    }
}, {
    timestamps: true
});

const CourseQuiz = mongoose.model('CourseQuiz', quizSchema);

module.exports = CourseQuiz;
