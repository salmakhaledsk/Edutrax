const mongoose = require('mongoose');
const joi = require('joi');

const SectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
  course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
  },
  {
    timestamps: true,
  }
);

SectionSchema.statics.getWithCourseDetails = function (id) {
  return this.findById(id).populate('course', ['_id', 'title', 'instructor', 'category', 'image']);
};


const Section = mongoose.model('Section', SectionSchema);

function createValidation(obj) {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    course: joi.string().min(3).required(),
  });
  return schema.validate(obj);
}

function updateValidation(obj) {
  const schema = joi.object({
    name: joi.string().min(3),
    course: joi.string().min(3),
  });
  return schema.validate(obj);
}
module.exports = {
  Section,
  createValidation,
  updateValidation,
};
