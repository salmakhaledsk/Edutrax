const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenAccess } = require("../middlewares/verifyToken");
const { getCourseLecture, postCourseLecture, putCourseLecture, deleteCourseLecture } = require("../controllers/courseLectureController")


router.get("/courselec/:id", verifyToken, getCourseLecture);

router.post("/", verifyTokenAccess, postCourseLecture);

router.put("/:id", verifyTokenAccess, putCourseLecture);

router.delete("/:id", verifyTokenAccess, deleteCourseLecture)

module.exports = router
