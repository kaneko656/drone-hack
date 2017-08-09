/*
 * 参考
 * https://liginc.co.jp/187633
 */

let RollingSpider = require('rolling-spider')
let keypress = require('keypress')
let logger = require('./logger.js')
let drive = require('./drive.js')
keypress(process.stdin)

process.stdin.setRawMode(true)
process.stdin.resume()

let ACTIVE = true
let STEPS = 5
let drone = new RollingSpider({
    // Parrot MAMBO of KeitaLab
    uuid: 'fbcbb8b7da3740568b2d68064122239b',
    logger: logger.on,
    // forceConnect: false
})



function cooldown() {
    ACTIVE = false
    setTimeout(() => {
        ACTIVE = true
    }, STEPS)
}

// Connects to the drone over BLE
drone.connect(() => {

    // Sets up the connection to the drone and enumerate all of the services and characteristics.
    drone.setup(() => {
        console.log('Configured for Rolling Spider! ', drone.name)
        drone.startPing()
        // drone.flatTrim()
        setTimeout(function() {
            console.log(drone.name + ' => SESSION START')
            ACTIVE = true
        }, 1000)

        // A message like 'Battery level: 30%' will be sent to logger
        drone.on('battery', () => {
            console.log('battery on')
        })

        // RSSI level
        drone.signalStrength((...arg) => {
            console.log(arg)
        })

        control(drone)

    })
})

function control(drone) {

    // drive.setDrone(drone)
    // drive.set('calibrate')
    // drive.set('takeoff')
    // drive.set('wait', {
    //     time: 3000
    // })
    // drive.set('up', {
    //     speed: 50,
    //     step: 20
    // })
    // drive.set('turnRight', {
    //     speed: 100,
    //     step: 100
    // })
    // drive.set('turnLeft', {
    //     speed: 100,
    //     step: 100
    // })
    // drive.set('up', {
    //     speed: 50,
    //     step: 20
    // })
    // drive.set('down', {
    //     speed: 50,
    //     step: 20
    // })
    // drive.set('up', {
    //     speed: 50,
    //     step: 20
    // })
    // drive.set('down', {
    //     speed: 50,
    //     step: 20
    // })
    // drive.set('wait', {
    //     time: 5000
    // })
    // drive.set('land')
    //
    // setTimeout(() => {
    //     drive.do()
    // }, 3000)
}





// listen for the "keypress" event
process.stdin.on('keypress', function(ch, key) {

    console.log('got "keypress" => ', key)

    if (ACTIVE && key) {

        let param = {
            tilt: 0,
            forward: 0,
            turn: 0,
            up: 0
        }

        if (key.name === 'l') {
            console.log('land')
            drone.land()
        } else if (key.name === 't') {
            console.log('takeoff')
            drone.takeOff()
        } else if (key.name === 'h') {
            console.log('hover')
            drone.hover()
        } else if (key.name === 'x') {
            console.log('disconnect')
            drone.disconnect()
            process.stdin.pause()
            process.exit()
        }

        if (key.name === 'up') {
            drone.forward({
                steps: STEPS
            })
            cooldown()
        } else if (key.name === 'down') {
            drone.backward({
                steps: STEPS
            })
            cooldown()
        } else if (key.name === 'right') {
            drone.tiltRight({
                steps: STEPS
            })
            cooldown()
        } else if (key.name === 'left') {
            drone.tiltLeft({
                steps: STEPS
            })
            cooldown()
        } else if (key.name === 'u') {
            drone.up({
                steps: STEPS
            })
            cooldown()
        } else if (key.name === 'd') {
            drone.down({
                steps: STEPS
            })
            cooldown()
        }

        if (key.name === 'm') {
            param.turn = 90
            drone.drive(param, STEPS)
            cooldown()
        }
        if (key.name === 'h') {
            param.turn = -90
            drone.drive(param, STEPS)
            cooldown()
        }
        if (key.name === 'f') {
            drone.frontFlip()
            cooldown()
        }
        if (key.name === 'b') {
            drone.backFlip()
            cooldown()
        }

    }
})
