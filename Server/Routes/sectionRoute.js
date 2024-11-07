const express = require('express');
const router = express.Router();
const { verifyTokenAnAdmin, verifyTokenAccess } = require("../middlewares/verifyToken");
const { getCourseSection, postCourseSection, putCourseSection, deleteCourseSection } = require("../controllers/courseSectionController")


router.get("/", verifyTokenAccess, getCourseSection);

router.post("/", verifyTokenAccess, postCourseSection);

router.put("/:id", verifyTokenAccess, putCourseSection);

router.delete("/:id", verifyTokenAccess, deleteCourseSection)

module.exports = router
