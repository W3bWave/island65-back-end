let axios = require('axios')
let { parse } = require('node-html-parser');
const express = require('express')
const router = express.Router()

async function getTracks(city = 1){
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
            trackObject.difficulty_name = "Сложная",
            trackObject.difficulty_in_num = 2
        }
        else if(DOM_track.querySelector(".track-option__number").classList.contains('track-option__number_style_3')){
            trackObject.difficulty_name = "Очень сложная",
            trackObject.difficulty_in_num = 3
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


module.exports = router

