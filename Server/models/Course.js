const mongoose = require('mongoose');
const joi = require('joi');

//course.title
//instructor.title
const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    header: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 500,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      minlength: 3,
      maxlength: 200,
    },
    lessons: {
      type: String,
      required: true,
    },
    hours: {
      type: String,
      required: true,
    },
    category: [{
      type: String,
      required: true,
      enum: [
        'Front End',
        'Back End',
        'JavaScript',
        'Full Stack',
        'CS50',
        'Security',
        'Network',
        "AWS",
        'ALL Courses',
      ],
    }],
    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 700,
    },
    type: {
      type: String,
      required: true,
    },
    willLearn: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1000,
    },
    requirement: {
      r1: { type: String, minlength: 3, maxlength: 1000, required: true, },
      r2: { type: String, minlength: 3, maxlength: 1000, required: true, }
    },
    image: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/01/08/18/25/desk-593327_1280.jpg",
        publicId: null,
      }
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', CourseSchema);

function createValidation(obj) {
  const schema = joi.object({
    title: joi.string().min(3).required(),
    header: joi.string().min(3).required(),
    instructor: joi.string().min(3).required(),
    lessons: joi.string().required(),
    hours: joi.string().required(),
    category: joi.array().items(joi.string().valid(
      'Front End',
      'Back End',
      'JavaScript',
      'Full Stack',
      'CS50',
      'Security',
      'Network',
      "AWS",
      'ALL Courses',
    )).required(),
    description: joi.string().required(),
    type: joi.string().required(),
    willLearn: joi.string().required(),
    requirement: {
      r1: joi.string().required(),
      r2: joi.string().required(),
    }
  });
  return schema.validate(obj);
}

function updateValidation(obj) {
  const schema = joi.object({
    title: joi.string().min(3),
    header: joi.string().min(3),
    instructor: joi.string().min(3),
    lessons: joi.string(),
    hours: joi.string(),
    category: joi.array().items(joi.string().valid(
      'Front End',
      'Back End',
      'JavaScript',
      'Full Stack',
      'CS50',
      'Security',
      'Network',
      "AWS",
      'ALL Courses',
    )),
    description: joi.string(),
    type: joi.string(),
    willLearn: joi.string(),
    requirement: joi.object({
      r1: joi.string().min(3).max(1000).optional(),
      r2: joi.string().min(3).max(1000).optional(),
    }).min(1),
  });
  return schema.validate(obj);
}

module.exports = {
  Course,
  createValidation,
  updateValidation,
};
