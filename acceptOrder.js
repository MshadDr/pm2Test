const axios = require('axios')
const fs = require('fs')

/**
 * start the process
 */

handler()
setInterval(()=> {
    handler()
}, 120000)

async function handler() {

    let fileNames = {}
    fs.readdirSync('logs').forEach((item, key) => {
        if( item.split('-')[0] === 'lastHashList' ) {
            
            fileNames[key] = item.match(/\d+/)[0]
        }    
    })

    let couriersId = Object.values(fileNames)

    const promise = []

    couriersId.forEach(id => {
        const courier = getClient(id)

        courier.then((activeOrderStatus)=> {
            if(activeOrderStatus) {
                console.log(1);

                let ordersList
                let data
                
                fs.readdirSync('logs').forEach((item) => {
                    if( item.split('-')[0] === 'lastHashList' && item.match(/\d+/)[0] === id ) {
                        
                        ordersList = JSON.parse(fs.readFileSync(`logs/${item}`))
                        if ( ordersList === [] || ordersList === null) {
                            return null;
                        }
                        const keys = Object.keys(ordersList);
                        let key = keys[Math.floor(Math.random() * keys.length)];
                        
                        if(key && key !== undefined){
                            data = {
                                orderId: ordersList[key].orderId,
                                courierId: id
                            }
                        }
                    }   
                })

                if(data && data !== undefined){
                    makeCall(data).then(response => {
                        console.log(response);
                    }).catch(err => {
                        console.log(err.message);
                    })
                }
                
            }
            else
            {
                console.log(2);
                canseleActiveOrder(id).then(response => {
                    promise.push(response)
                }).catch(err => {
                    console.log(err.message);
                })                
            }
        })
})

    await Promise.all(promise);
    return "accept Order request was sent successfuly"

}    

/**
 * 
 * @param {*} courierId 
 * @returns 
 */
async function makeCall(data) {

await axios.post('http://localhost:8141/v1/accept-order', (data))

}

/**
 * 
 * @param {*} courierId 
 */
async function canseleActiveOrder( courierId ) {

    await axios.post('http://localhost:8141/v1/close-active-order', ({
        courierId: courierId
    }))
}

/**
 * 
 * @param {*} id 
 * @returns 
 */
async function getClient(id) {

    const redis = require('redis')

    const client = redis.createClient({
        host: 'redis',
        port: 6379,
        password: "root"
    });
    client.connect()

    const courier = JSON.parse ( await client.HGET(`courier.${id}`, 'detail') )

    if(!courier.activeOrder || courier.activeOrder === [] || !courier.activeOrder[0].orderId ){
        
        return true
    }

    return false
}
