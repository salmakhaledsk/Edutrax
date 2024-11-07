const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("decoded", decoded);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "invalid token" })
        }
    } else {
        res.status(401).json({ message: "no token provided" })
    }
}

//admin and user
function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === "admin" ) {
            next()
        } else {
            return res.status(403).json({ message: "you aren't allowed" })
        }
    })
}

//admin and instructor
function verifyTokenAccess(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "admin" || req.user.role === "instructor") {
            next()
        } else {
            return res.status(403).json({ message: "you aren't allowed" })
        }
    })
}

//only admin
function verifyTokenAnAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "admin") {
            next()
        } else {
            return res.status(403).json({ message: "you aren't allowed , only admin allowed" })
        }
    })
}

//only instructor
function verifyTokenAnInstructor(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "instructor") {
            next()
        } else {
            return res.status(403).json({ message: "you aren't allowed , only instructor allowed" })
        }
    })
}

//only user
function verifyTokenAnUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next()
        } else {
            return res.status(403).json({ message: "you aren't allowed" })
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAnAdmin,
    verifyTokenAccess,
    verifyTokenAnInstructor,
    verifyTokenAnUser
};