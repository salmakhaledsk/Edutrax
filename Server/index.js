const express = require('express');

//Paths
const ConnectToDB = require("./config/db")
const logger = require("./middlewares/logger")
const { notFound, errorHandle } = require("./middlewares/errors")
require("dotenv").config();
const path = require("path");
const helmet = require("helmet")
const cors = require("cors")

//Connect To MongoDB
ConnectToDB();

//Init App
const app = express();

app.get("/test",(req,res)=>{
    res.send({message:"Hello World"})
})

//Static Folder
app.use(express.static(path.join(__dirname,"images")));

//  Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger)

//Helmet
app.use(helmet());

//Cors Policy
app.use(cors({
    // origin: "http://localhost:3000"
    origin: "*"
}))

//Set View Engine
app.set('view engine', 'ejs')


//Routes
app.use("/api/courses", require("./Routes/courses"))
app.use("/api/auth", require("./Routes/auth"))
app.use("/api/users", require("./Routes/users"))
app.use("/password", require("./Routes/password"))
app.use("/api/enroll-course", require("./Routes/enrollRoute"));
app.use("/api/course-section", require("./Routes/sectionRoute"));
app.use("/api/course-lecture", require("./Routes/lectureRoute"));
app.use("/quizzes", require("./Routes/quizRoute"));
app.use("/coursequiz", require("./Routes/courseQuizRoute"));


//Error Handling MiddleWare
app.use(notFound);
app.use(errorHandle);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Run Successfully in ${process.env.NODE_ENV} mode on Port ${PORT}`
    );
});

