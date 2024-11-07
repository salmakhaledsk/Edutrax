const mongoose = require('mongoose');
const joi = require('joi');

const EnrollSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course'
    },
  },
  {
    timestamps: true,
  }
);

const Enroll = mongoose.model('Enroll', EnrollSchema);

function createValidation(obj) {
  const schema = joi.object({
    user: joi.string().min(3),
    course: joi.string().required(),
  });
  return schema.validate(obj);
}

// function updateValidation(obj) {
//   const schema = joi.object({
//     user: joi.string().min(3).required(),
//     course: joi.string().required(),
//   });
//   return schema.validate(obj);
// }
module.exports = {
  Enroll,
  createValidation,
};
