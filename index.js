const express = require('express');
const cors = require('cors');


let app = express();


app.use(cors());

app.get('/',(req,res)=>{
    res.json({
        "status" : 200,
        "welcome" : "to hackaton"
    })
});


app.listen(80)