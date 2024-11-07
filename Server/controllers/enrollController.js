const asyncHandler = require('express-async-handler');
const { Enroll, createValidation } = require('../models/Enroll');
const { Course } = require('../models/Course');

const enrollCourse = asyncHandler(async (req, res) => {
    try {
        // Validate the incoming request data.
        const { error } = createValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Get the user ID from the token
        const userIdFromToken = req.user ? req.user.id : undefined;

        // Get the user ID from the route parameters
        const userIdFromParams = req.params.userId;
        console.log(userIdFromParams);
        console.log(userIdFromToken);

        // Check if the user ID from the token matches the user ID from the route parameters
        if (!userIdFromToken || userIdFromToken.toString() !== userIdFromParams.toString()) {
            return res.status(403).json({ message: "You aren't allowed to perform this action" });
        }

        // Check if the user is already enrolled in the course
        const existingEnrollment = await Enroll.findOne({ user: userIdFromToken, course: req.body.course });
        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        // Create a new enrollment record
        const newEnrollment = new Enroll({
            user: userIdFromToken,
            course: req.body.course,
        });

        // Save the enrollment record
        await newEnrollment.save();
        const courseDetails = await Course.findById(req.body.course, ["_id", "title", "instructor", "avatar"]);

        // Respond with success message and enrolled course details
        res.status(201).json({ message: "Course successfully enrolled", "Course Enrollment": courseDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const unenrollCourse = asyncHandler(async (req, res) => {
    try {
        // Get the user ID from the token
        const userIdFromToken = req.user ? req.user.id : undefined;

        // Get the enrollment ID from the request parameters
        const enrollmentId = req.params.enrollmentId;

        // Find the enrollment by ID and user ID
        const enrollment = await Enroll.findOneAndDelete({ id: enrollmentId, user: userIdFromToken });

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        res.status(200).json({ message: "Course successfully unenrolled", enrollment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

const getAllEnrolledCourse = async (req, res) => {
    try {
        const enrollments = await Enroll.find({ user: req.user.id }).populate("course", ["_id", "title","type","instructor","image"]);

        if (!enrollments || enrollments.length === 0) {
            return res.status(404).json({ message: "No enrolled courses found for the user" });
        }

        const enrolledCourses = enrollments.map(enrollment => enrollment.course);
        res.status(200).json({ "Enrolled Courses": enrolledCourses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getEnrollCount = asyncHandler(async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const count = await Enroll.distinct("user", { course: courseId }).countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error retrieving enrollment count:', error);
        res.status(500).json({ message: 'Error retrieving enrollment count', error: error.message });
    }
});

module.exports = {
    enrollCourse,
    unenrollCourse,
    getAllEnrolledCourse,
    getEnrollCount
}
