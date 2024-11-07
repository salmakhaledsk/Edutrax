const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenAnAdmin, verifyTokenAccess } = require("../middlewares/verifyToken")
const { getAllCourses, getCourseById, postCourse, putCourse, deleteCourse, coursePhotoUpload } = require('../controllers/courseController');
const photoUpload = require("../middlewares/photoUpload");


/////////////////////////////////////////////////////////////////////////////////////////////////


router.get("/", getAllCourses)

router.get("/:id", getCourseById)

router.post("/", verifyTokenAccess, postCourse);

router.put("/:id", verifyTokenAccess, putCourse);

router.delete("/:id", verifyTokenAnAdmin, deleteCourse)

router.post("/:id/image", verifyToken, photoUpload.single("image"), coursePhotoUpload)



module.exports = router;