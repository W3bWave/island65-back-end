const express = require('express');
const cors = require('cors');
const telegram = require('./routes/telegram');
const gvRoute = require('./routes/gv');
const fs = require('fs');

let app = express();
app.use(cors());

app.get('/',(req,res)=>{
    res.json({
        "status" : 200,
        "welcome" : "to hackaton"
    })
});

app.use('/api/v1/telegram',telegram);
app.use('/api/v1/gv',gvRoute);


app.listen(80)