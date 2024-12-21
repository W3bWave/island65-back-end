let axios = require('axios')
let { parse } = require('node-html-parser');
const express = require('express')
const router = express.Router()


async function getTracks(city = 1){
    console.log("получаю трэки");
    
    let request = await axios.get("https://ski-gv.ru/hills/"+city+"/1/");
    let FAKEDOM = parse.parse(request.data);
    let DOM_tracks = FAKEDOM.querySelectorAll(".track-option")
    let result_tracks = [];

    for(let DOM_track of DOM_tracks){

        let trackObject = {
            number : null,
            difficulty_in_num: null,
            difficulty_name: null,
            name : null,
            length: null,
            height : null,
            time : null,
            status : null,
            status_text : null,
        }
        trackObject.number = DOM_track.querySelector(".track-option__number").textContent;
        if(DOM_track.querySelector(".track-option__number").classList.contains('track-option__number_style_1')){
            trackObject.difficulty_name = "Простая",
            trackObject.difficulty_in_num = 1
        }
        else if(DOM_track.querySelector(".track-option__number").classList.contains('track-option__number_style_2')){
            trackObject.difficulty_name = "Средняя",
            trackObject.difficulty_in_num = 2
        }
        else if(DOM_track.querySelector(".track-option__number").classList.contains('track-option__number_style_3')){
            trackObject.difficulty_name = "Сложная",
            trackObject.difficulty_in_num = 3
        }
        else if(DOM_track.querySelector(".track-option__number").classList.contains('track-option__number_style_4')){
            trackObject.difficulty_name = "Очень сложная",
            trackObject.difficulty_in_num = 4
        }
        trackObject.name = DOM_track.querySelector(".track-option__name").textContent;
        trackObject.length = DOM_track.querySelector(".icon_image_track-length").parentNode.textContent.replaceAll(' ','');
        trackObject.height = DOM_track.querySelector(".icon_image_track-height").parentNode.textContent.replaceAll(' ','');
        if(DOM_track.querySelector(".icon_image_clock")){
            trackObject.time = DOM_track.querySelector(".icon_image_clock").parentNode.textContent
        }
        trackObject.status_text = DOM_track.querySelector(".track-status").textContent
        trackObject.status = (DOM_track.querySelector(".track-status").classList.contains("track-status_closed")) ? 'closed' : 'opened'
        let keys = Object.keys(trackObject);
        for(let key of keys){
            trackObject[key] = new String(trackObject[key]).replaceAll('\n','').replaceAll('\t','')
        }
        result_tracks.push(trackObject);
    }
    return result_tracks
}

async function getCities(){
    console.log("получаю города");
    let request = await axios.get("https://ski-gv.ru/hills/1/1/");
    let FAKEDOM = parse.parse(request.data);
    let result = []
    let cities_array = FAKEDOM.querySelectorAll('.gv-select__option')
    for(let a in cities_array){
        
        result.push({
            id : ~~a+1,
            name : cities_array[a].textContent.replaceAll('\n',' ').replaceAll('\t','').replaceAll("t\\",' ')
        })
    }
    
    return result;
    
    
}



router.get("/cities", async (req, res) => {
    let cities = await getCities();
    res.json(cities);
})

router.get(['/tracks/:num','/tracks/'], async (req, res) => {
    let tracks;
    if(req.params.num){
        tracks = await getTracks(req.params.num);
    }
    else{
        tracks = await getTracks();
    }
    
    res.json(tracks);
})

async function getTariffs(){
     let request = await axios.get("https://ski-gv.ru/about-us/tarif/");
    let FAKEDOM = parse.parse(request.data);
    let result = []

    rows = FAKEDOM.querySelector("table").querySelectorAll("tr")

    for(let row of rows){
        let cols = row.querySelectorAll("th")
        let object = {}
        for(let col in cols){
            
            if(col == 0) object.name = cols[0].textContent.replaceAll('\n','')
            if(col == 1) object.price_by_card = cols[1].textContent.replaceAll(' ',' ')
            if(col == 2) object.price_by_sakh_card = cols[2].textContent.replaceAll(' ','').replaceAll('\n','').replaceAll('-  ','-')
        }
        if(object.name && object.price_by_card){
            result.push(object)
        }
    }
    return result;
}

router.get('/weather',async (req,res)=>{
    let reqs = await axios.get("https://api.weather.yandex.ru/v2/forecast?lat=46.95417072340388&lon=142.77982276089583&limit=1&lang=RU&theme=dark",{
        headers : {
            'X-Yandex-Weather-Key' : "8ec7342a-19c2-4d07-a91c-2809b8f03acb"
        }
    })
    res.json(reqs.data);
})

router.get('/tarifs',async (req,res)=>{
    let tariffs = await getTariffs();

    res.json({
        skipass : tariffs,
        other : [],
        rent : []
    })
})

let WebSocket = require('ws');
const { sendMessage } = require('./telegram');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('Новый клиент подключился!');
 


  ws.on('message', (message) => {
    let json = JSON.parse(message);
    console.log(json);
    
    if(json.action == "REGISTER_SESSION"){
        ws.user = json.user;
        console.log("registered");
        
    }
    
  });
  
  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});



router.post('/companion/start',async (req,res)=>{
    console.log(req.body);
    for(let client of wss.clients){
        if(client.user.id != req.body.user.id){
            client.send(JSON.stringify({
                action : "STARTED_COMPANION_WAIT",
                userData : req.body.user
            }))
        }
    }
    res.json({"ok":"ok"})
})


router.post('/companion/stop',async (req,res)=>{
    console.log(req.body);
    for(let client of wss.clients){
        if(client.user.id != req.body.user){
            client.send(JSON.stringify({
                action : "STOPED_COMPANION_WAIT",
                userData : {
                    id : req.body.user
                }
            }))
        }
    }
    res.json({"ok":"ok"})
})

router.post('/companion/offer',async (req,res)=>{
    console.log(req.body);
    let sent = false;
    for(let client of wss.clients){
        if(client.user.id == req.body.to.id){
            client.send(JSON.stringify({
                action : "COMPANION_OFFER_FOR_YOU",
                from : {
                    id : req.body.from
                }
            }))
            sent = true;
        }
    }

    if(sent === false){
        sendMessage(req.body.to.id, `Уведомление!\nПользователь: ${req.body.from.user.first_name} предлагает вам стать его попутчиком`)
    }
    res.json({"ok":"ok"})
})

module.exports = router

