const asyncHandler = require('express-async-handler');
const { Lecture, createValidation, updateValidation, } = require("../models/lecture")
const { Course } = require("../models/Course")


const getCourseLecture = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)
    if (!course) {
        res.status(404).send({ message: "The Course with the given ID was not found." });
    } else {
        const courseLectures = await Lecture.find({ course: course.id });
        console.log(course.id);
        if (courseLectures) {
            res.status(200).json(courseLectures);
        }
        res.status(404).send({ message: "The Lectures with the given Course ID was not found." });
    }
});

// const getCourseLecture = asyncHandler(async (req, res) => {
//     const { courseId } = req.body;
//     if (!courseId) {
//         return res.status(400).send({ message: "Course ID is required in the request body." });
//     }

//     const course = await Course.findById(courseId);
//     if (!course) {
//         return res.status(404).send({ message: "The Course with the given ID was not found." });
//     }

//     const courseLectures = await Lecture.find({ course: course.id });
//     if (courseLectures && courseLectures.length > 0) {
//         return res.status(200).json(courseLectures);
//     }

//     return res.status(404).send({ message: "No lectures found for the given course ID." });
// });


const postCourseLecture = asyncHandler(async (req, res) => {
    const { error } = createValidation(req.body);
    if (error) {
        res.status(400).send({ message: "Invalid data", details: error.message })
    } else {
        const courseLec = new Lecture(
            {
                name: req.body.name,
                section: req.body.section,
                course: req.body.course,
                link: req.body.link,
            }
        )
        const result = await courseLec.save();
        res.status(201).json(result)
    }
});

const putCourseLecture = asyncHandler(async (req, res) => {
    const { error } = updateValidation(req.body);
    if (error) {
        res.status(400).send({ message: "Invalid data", details: error.message })
    }
    const courseLec = await Lecture.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            section: req.body.section,
            course: req.body.course,
            link: req.body.link,
        }
    }, { new: true }); // return updated document
    if (!courseLec) {
        res.status(404).send({ message: "Course Lecture Not Found" });
    } else {
        res.status(200).json({ message: "updted", Course: courseLec });
    }
});

const deleteCourseLecture = asyncHandler(async (req, res) => {
    const courseLec = await Lecture.findById(req.params.id);
    if (!courseLec) {
        res.status(404).send({ message: "Course Lecture Not Found" });
    } else {
        await Lecture.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Course Lecture Deleted" })
    }
})

module.exports = {
    getCourseLecture,
    postCourseLecture,
    putCourseLecture,
    deleteCourseLecture
}