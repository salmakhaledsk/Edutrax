const asyncHandler = require('express-async-handler');
const { Course, createValidation, updateValidation } = require("../models/Course");
const path = require('path');
const fs = require('fs');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary")

//Get All Courses
const getAllCourses = asyncHandler(async (req, res) => {
    courseList = await Course.find().populate("instructor", ["_id", "name", "email", "avatar","title" ,"about"]);
    res.status(200).json(courseList);
});

//Get Course by id
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id).populate("instructor", ["_id", "name", "email", "avatar","title" ,"about"]);
    if (!course) {
        res.status(404).send({ message: "The Course with the given ID was not found." });
    } else {
        res.status(200).json(course);
    }
});

//Add Course
const postCourse = asyncHandler(async (req, res) => {
    const { error } = createValidation(req.body);
    if (error) {
        res.status(400).send({ message: "Invalid data", details: error.message })
    } else {
        const course = new Course(
            {
                title: req.body.title,
                header: req.body.header,
                instructor: req.body.instructor,
                lessons: req.body.lessons,
                hours: req.body.hours,
                category: req.body.category,
                description: req.body.description,
                type: req.body.type,
                willLearn: req.body.willLearn,
                requirement: {
                    r1: req.body.requirement.r1,
                    r2: req.body.requirement.r2
                }
            }
        )
        const result = await course.save();
        res.status(201).json(result)
    }
});

//Edit Course
const putCourse = asyncHandler(async (req, res) => {
    const { error } = updateValidation(req.body);
    if (error) {
        res.status(400).send({ message: "Invalid data", details: error.message })
    }
    const updateObj = {
        $set: {
            title: req.body.title,
            header: req.body.header,
            instructor: req.body.instructor,
            lessons: req.body.lessons,
            hours: req.body.hours,
            category: req.body.category,
            description: req.body.description,
            type: req.body.type,
            willLearn: req.body.willLearn,
        }
    };

    // Update each field inside the requirement object individually if provided
    if (req.body.requirement) {
        const { r1, r2 } = req.body.requirement;
        if (r1 !== undefined) {
            updateObj.$set['requirement.r1'] = r1;
        }
        if (r2 !== undefined) {
            updateObj.$set['requirement.r2'] = r2;
        }
    }
    const course = await Course.findByIdAndUpdate(req.params.id, updateObj, { new: true });

    if (!course) {
        res.status(404).send({ message: "Course Not Found" });
    } else {
        res.status(200).json({ message: "updted", Course: course });
    }
});

//upload course image
const coursePhotoUpload = asyncHandler(async (req, res) => {

    //Validation
    if (!req.file) {
        return res.status(400).json({ message: "No File Provided" });
    }

    if (!['admin', 'instructor'].includes(req.user.role)) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    //Get the course from DB
    const course = await Course.findById(req.params.id);
    if (course) {
        const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

        // Upload to cloudinary
        const result = await cloudinaryUploadImage(imagePath);
        console.log(result);


        //Delete the old  photo if exist
        if (course.image.publicId !== null) {
            await cloudinaryRemoveImage(course.image.publicId);
        }

        //Change the profilePhoto field in the DB
        course.image = {
            url: result.secure_url,
            publicId: result.public_id,
        };
        await course.save();

        //Send response to client
        res.status(200).json({
            message: "Course Image uploaded successfully",
            image: { url: result.secure_url, publicId: result.public_id },
        });

        //Remvoe image from the server
        fs.unlinkSync(imagePath);
    }
    res.status(403).json({ message: "Course Not Found :(" });
});

//Delete Course
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404).send({ message: "Course Not Found" });
    } else {
        if (course.image.publicId !== null) {
            await cloudinaryRemoveImage(course.image.publicId);
        }
        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Course Deleted" })
    }
})

module.exports = {
    getAllCourses,
    getCourseById,
    postCourse,
    putCourse,
    deleteCourse,
    coursePhotoUpload
}