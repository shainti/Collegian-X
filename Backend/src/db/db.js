const moongose = require('mongoose');

function connectdb(){
    moongose.connect(process.env.DB_PATH).then(()=>{
        console.log("db connect succefully")
    }).catch(err => {
        console.log("error while connect to the database");
    })
}

module.exports = connectdb;