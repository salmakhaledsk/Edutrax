const mongoose = require('mongoose');
const joi = require('joi');

const LectureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'section',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    link: {
      type: String,
      minlength: 3,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

const Lecture = mongoose.model('Lecture', LectureSchema);

function createValidation(obj) {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    section: joi.string().min(3),
    course: joi.string().required(),
    link: joi.string().required(),
  });
  return schema.validate(obj);
}

function updateValidation(obj) {
  const schema = joi.object({
    name: joi.string().min(3),
    section: joi.string().min(3),
    course: joi.string(),
    link: joi.string(),
  });
  return schema.validate(obj);
}
module.exports = {
  Lecture,
  createValidation,
  updateValidation,
};
