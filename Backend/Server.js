const app = require('./src/app')
const connectdb = require("./src/db/db")

connectdb();
const PORT = 3000;
const HOST = 'localhost'
app.listen(PORT, HOST, ()=>{
    console.log(`server start at http://${HOST}:${PORT}`);
})

exports.app = app;