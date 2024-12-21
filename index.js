const express = require('express');
const cors = require('cors');
const {telegramRouter} = require('./routes/telegram');
const gvRoute = require('./routes/gv');
const fs = require('fs');
const bodyParser = require('body-parser');

let app = express();
app.use(cors());

app.get('/',(req,res)=>{
    res.json({
        "status" : 200,
        "welcome" : "to hackaton"
    })
});
app.use(bodyParser.json())
app.use('/api/v1/telegram',telegramRouter);
app.use('/api/v1/gv',gvRoute);


app.listen(80)