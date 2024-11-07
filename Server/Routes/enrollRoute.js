const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyToken");
const { enrollCourse, unenrollCourse, getAllEnrolledCourse, getEnrollCount } = require("../controllers/enrollController")

router.post("/enroll/:userId", verifyToken, enrollCourse);
router.get("/allenrollment/:enrolled", verifyToken, getAllEnrolledCourse);
router.get("/count/:courseId", getEnrollCount);
router.delete("/:enrollment", verifyToken, unenrollCourse);

module.exports = router;

