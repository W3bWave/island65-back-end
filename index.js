const express = require('express');
const cors = require('cors');
const { route } = require('./routes/telegram');

let app = express();
app.use(cors());

app.get('/',(req,res)=>{
    res.json({
        "status" : 200,
        "welcome" : "to hackaton"
    })
});

app.use(route);


app.listen(80)