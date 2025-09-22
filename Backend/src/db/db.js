const mongoose = require('mongoose');
function connectdb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected successfully");
    }).catch((error) => {
        console.log("Database connection failed");
        console.log(error);
    });
}
module.exports=connectdb;