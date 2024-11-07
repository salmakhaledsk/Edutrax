const asyncHandler = require('express-async-handler');
const { Section, createValidation, updateValidation, } = require("../models/section");
const { Course } = require('../models/Course');

const getCourseSection = asyncHandler(async (req, res) => {
    courseList = await Section.find().populate("course", ["_id", "title", "instructor", "lessons", "hours", "category", "image"]);
    res.status(200).json(courseList);
});

const postCourseSection = asyncHandler(async (req, res) => {
    const { error } = createValidation(req.body);
    if (error) {
        res.status(400).send({ message: "Invalid data", details: error.message })
    } else {
        const courseSection = new Section(
            {
                name: req.body.name,
                course: req.body.course,
            }
        )
        const result = await courseSection.save();
        const courseDetailes = await Section.getWithCourseDetails(result._id);

        res.status(201).json(courseDetailes)
    }
});

const putCourseSection = asyncHandler(async (req, res) => {
    const { error } = updateValidation(req.body);
    if (error) {
        res.status(400).send({ message: "Invalid data", details: error.message })
    }
    const courseSection = await Section.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            course: req.body.course,
        }
    }, { new: true }); // return updated document
    if (!courseSection) {
        res.status(404).send({ message: "Course Not Found" });
    }
    const courseDetailes = await Section.getWithCourseDetails(courseSection._id);
    res.status(200).json({ message: "updted", courseDetailes });

});

const deleteCourseSection = asyncHandler(async (req, res) => {
    const courseSection = await Section.findById(req.params.id);
    if (!courseSection) {
        res.status(404).send({ message: "Course Section Not Found" });
    }
    await Section.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course Section Deleted" })

})

module.exports = {
    getCourseSection,
    postCourseSection,
    putCourseSection,
    deleteCourseSection
}