const express = require("express");
const app = express();


app.get('/',(req, res) => {
res.send("hello this is backend yoo");
})

const PORT = 3000; 
app.listen(PORT, ()=>{
    console.log(`server stat at: http://localhost:${PORT}`)
})
