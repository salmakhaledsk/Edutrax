const { Course } = require("./models/Course");
const { User } = require("./models/User")
const { courses, instructors } = require("./data");
const dbConnection = require("./config/db")
require("dotenv").config();

//connection to db
dbConnection();

//import Courses
const importCourses = async () => {
    try {
        await Course.insertMany(courses);
        console.log('Course imported successfully (^_^)');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

//Remove Courses
const removeCourse = async () => {
    try {
        await Course.deleteMany();
        console.log('Course removed successfully (^_^)');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

//import Instructors
const importInstructors = async () => {
    try {
        await User.insertMany(instructors);
        console.log('Instructors imported successfully (^_^)');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

//remove Instructors
const removeInstructors = async () => {
    try {
        await User.deleteMany();
        console.log('Instructors removed successfully (^_^)');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if (process.argv[2] === "-import") {
    importCourses();
} else if (process.argv[2] === "-remove") {
    removeCourse();
} else if (process.argv[2] === "-import-instructor") {
    importInstructors();
} else if (process.argv[2] === "-remove-instructors") {
    removeInstructors();
}

