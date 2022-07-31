const fs = require('fs')
const h3 = require('h3-js')
const redis = require('redis')

const client = redis.createClient({
    host: 'redis',
    port: 6379,
    password: "root"
});
client.connect()

let minLat = 35.657763
let maxLat = 35.771602
let minLng = 51.261103
let maxLng = 51.501267


let data ={}

for (let index = 0; index < 200; index++) {
    
    let orderId = Math.floor(Math.random() * 9999999 ) + 1
    let randLat = (Math.random() * (maxLat - minLat)) + minLat
    let randLng = (Math.random() * (maxLng - minLng)) + minLng
    let city = "alopeyk"
    let transportType = "motorbike"
    let zoneId = h3.geoToH3(randLat, randLng,9)

    data[index] = { 
                orderId: orderId,
                acceptedLat: randLat,
                acceptedLng: randLng,
                city: city,
                transportType: transportType,
                zoneId: zoneId,
                createdAt: new Date()
                }

    client.HSET(`order.${orderId}`, 'detail', JSON.stringify(data[index]) )
}

if( fs.existsSync('logs/ordersList.json') ) {
    fs.unlinkSync('logs/ordersList.json')
}

if(  fs.existsSync('../position-service/public/ordersList.json')  ) {
    fs.unlinkSync('../position-service/public/ordersList.json')
}
fs.appendFileSync('logs/ordersList.json', JSON.stringify(Object.values(data), null, '\t'),)
fs.appendFileSync('../position-service/public/ordersList.json', JSON.stringify(Object.values(data), null, '\t'),)

client.QUIT()
return "done"
