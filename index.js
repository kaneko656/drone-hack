/*
 * 参考
 * https://liginc.co.jp/187633
 */

let RollingSpider = require('rolling-spider')
let keypress = require('keypress')
let logger = require('./logger.js')
let drive = require('./drive.js')
const Job = require('./cron.js')
const piControl = require('./pi_control.js')
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

let myBot = require('./exCall-module/exBot')({
    team: 'keitalab',
    pass: '1108'
})

myBot.connect((exBot) => {
    let turnTime = 200
    let lastTime = 0
    let direct = 'x'
    exBot.on('test/drone', (operator, body) => {
        let x = body.x
        let y = -body.y // x方向だけ
        let target = 0
        let controlX = piControl.get(target, x)
        let controlY = piControl.get(target, y)
        if (Date.now() - lastTime > turnTime) {
            if (direct == 'x' && Math.abs(controlY) > Math.abs(controlX)) {
                direct = 'y'
                lastTime = Date.now()
            } else if (direct == 'y' && Math.abs(controlY) < Math.abs(controlX)) {
                direct = 'x'
                lastTime = Date.now()
            }
        }
        if (droneConnect) {
            if (direct == 'x') {
                let speed = Math.round(Math.sqrt(Math.abs(controlX) * 3000))
                console.log('x', speed, controlX)
                if (controlX > 0.03) {
                    drone.tiltRight({
                        steps: 5,
                        speed: speed
                    })
                } else if (controlX < -0.03) {
                    drone.tiltLeft({
                        steps: 5,
                        speed: speed
                    })
                }
            }
            if (direct == 'y') {
                let speed = Math.round(Math.sqrt(Math.abs(controlY) * 3000))
                console.log('y', speed, controlY)
                if (controlY > 0.03) {
                    drone.forward({
                        steps: 5,
                        speed: speed
                    })
                } else if (controlY < -0.03) {
                    drone.backward({
                        steps: 5,
                        speed: speed
                    })
                }
            }
        } else {
            console.log(controlX, controlY, direct)
        }
    })
})


let droneConnect = false
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
            droneConnect = true
        }, 1000)



        // A message like 'Battery level: 30%' will be sent to logger
        drone.on('battery', () => {
            console.log('battery on')
        })

        // RSSI level
        drone.signalStrength((...arg) => {
            console.log(arg)
        })

        // setTimeout(() => {
        //     // 同時は無理
        //     stepCall(15000, (t, steps) => {
        //
        //         if (0 < t && t < 1000) {
        //             drone.tiltRight({
        //                 steps: steps
        //             })
        //         } else if (4000 < t && t < 5000) {
        //
        //             drone.backward({
        //                 steps: steps
        //             })
        //         } else if (8000 < t && t < 9000) {
        //             drone.tiltLeft({
        //                 steps: steps
        //             })
        //         } else if (12000 < t && t < 13000) {
        //             drone.forward({
        //                 steps: steps
        //             })
        //         }
        //     })
        // }, 10000)


        // setTimeout(() => {
        //     stepCall(1500, (t, steps) => {
        //         console.log('→')
        //         drone.tiltRight({
        //             steps: steps
        //         })
        //     })
        // }, 10000)
        //
        // setTimeout(() => {
        //     stepCall(1500, (t, steps) => {
        //         console.log('↑')
        //         drone.forward({
        //             steps: steps
        //         })
        //     })
        // }, 12000)
        //
        // setTimeout(() => {
        //     stepCall(1500, (t, steps) => {
        //         console.log('←')
        //         drone.tiltLeft({
        //             steps: steps
        //         })
        //     })
        // }, 14000)
        //
        // setTimeout(() => {
        //     stepCall(1500, (t, steps) => {
        //         console.log('↓')
        //         drone.backward({
        //             steps: steps
        //         })
        //     })
        // }, 16000)








        // control(drone)


    })
})

function stepCall(millis, callback = () => {}, finishCall = () => {}) {
    let steps = 5
    for (let t = 0; t <= millis; t += steps) {
        let finish = (t + steps > millis)
        let date = new Date(Date.now() + t)
        Job(date, () => {
            callback(t, steps)
            if (finish) {
                finishCall()
            }
        })
    }
}

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
