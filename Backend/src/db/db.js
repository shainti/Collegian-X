const moongose = require('mongoose');


const DB_PATH = "mongodb://localhost:27017/food-view";
function connectdb(){
    moongose.connect(DB_PATH).then(()=>{
        console.log("db connect succefully")
    }).catch(err => {
        console.log("error while connect to the database");
    })
}

module.exports = connectdb;