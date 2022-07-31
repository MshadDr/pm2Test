"use strict"

const fs = require('fs')
const XMLHttpRequest = require('xhr2')

let minLat = 35.657763
let maxLat = 35.771602
let minLng = 51.261103
let maxLng = 51.501267

let randLat
let randLng
    
let courierId = Math.floor(Math.random() * 1100) + 1

randLat = (Math.random() * (maxLat - minLat)) + minLat
randLng = (Math.random() * (maxLng - minLng)) + minLng

setInterval(()=>{
    randLat = (Math.random() * (maxLat - minLat)) + minLat
    randLng = (Math.random() * (maxLng - minLng)) + minLng
},60000)

let city = "alopeyk"
let transportType = "motorbike"

fs.appendFileSync('logs/onlineCouriers.json', JSON.stringify(courierId, null, '\t'))


    setInterval(() => {
        var xhr = new XMLHttpRequest();

        xhr.open("POST", 'http://localhost:8141/v1/order');

        xhr.responseType = 'json';

        
        xhr.setRequestHeader('Content-Type', 'application/json');
    

        xhr.onload = () => {
            if ( xhr.status >= 200  && xhr.status < 300 ) {

                fs.appendFileSync(`logs/hashList-courier:${courierId}.json`, JSON.stringify(xhr.response,null,'\t'))
                console.log(xhr.response);
                if(xhr.response !== null) {
                    fs.writeFileSync(`logs/lastHashList-courier:${courierId}.json`,JSON.stringify(xhr.response,null,'\t'))    
                }
                
            }else {
                fs.appendFileSync(`logs/error-courier:${courierId}.json`, JSON.stringify(xhr.response,null,'\t'))
            }
        }

        xhr.onerror = () => {
            console.log();("Something went wrong!")
        } 
 
        xhr.send(JSON.stringify({
            "courierId": courierId,
            "lat": randLat,
            "lng": randLng,
            "city": city,
            "transportType": transportType,
            "vip": false
        }) );
    }, 1000) 

