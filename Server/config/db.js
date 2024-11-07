const mongoose = require('mongoose');
function ConnectToDB() {
    mongoose.connect(process.env.MONGO_CLOUD_URI)
        .then(() => console.log("Connected to MongoDB (^_^)"))
        .catch(err => console.error("Connection Failed To mongoDB!", err));
}
module.exports = ConnectToDB;