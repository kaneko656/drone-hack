let stack = []
let drone
let stepInterval = 500

exports.setDrone = (_drone) => {
    drone = _drone
}
exports.set = (method, options) => {
    stack.push({
        method: method,
        options: options || {}
    })
}

exports.do = () => {
    let startTime = Date.now()
    let stepDo = () => {
        let st = (Date.now() - startTime) / 1000
        console.log('Do', st.toFixed(3) + 's')
        step(() => {
            let et = (Date.now() - startTime) / 1000
            console.log('Finish', et.toFixed(3) + 's')

            setTimeout(() => {
                stepDo()
            }, stepInterval)
        }, () => {
            console.log('Response Error')
            stepDo()
        })
    }
    stepDo()
}

let step = exports.step = (callbackSuccess = () => {}, callbackError = () => {}) => {
    if (stack.length == 0) {
        return
    }

    let isSend = false
    let timeout = 10000
    let isSuccess = false
    let isError = false
    let s = stack[0]

    console.log(s)

    let call = () => {
        isSend = true
        setTimeout(() => {
            callError()
        }, timeout)
    }

    let callSuccess = () => {
        if (stack.length >= 1) {
            stack.splice(0, 1)
        }
        isSuccess = true
        callbackSuccess()
    }

    let callError = () => {
        if (isSend && !isSuccess) {
            callbackError()
        }
    }

    if (s.method == 'wait') {
        call()
        setTimeout(() => {
            callSuccess()
        }, s.options.time || 1000)
    } else if (s.method == 'calibrate') {
        call()
        drone.calibrate(() => {
            callSuccess()
        })
    } else if (s.method == 'flatTrim') {
        call()
        drone.flatTrim(() => {
            callSuccess()
        })
    } else if (s.method == 'takeoff') {
        call()
        drone.takeoff(() => {
            callSuccess()
        })

    } else if (s.method == 'land') {
        call()
        drone.land(() => {
            callSuccess()
        })
    } else if (s.method == 'toggle') {
        call()
        drone.toggle(() => {
            callSuccess()
        })
    } else if (s.method == 'hover') {
        call()
        drone.hover(() => {
            callSuccess()
        })
    } else if (s.method == 'up') {
        call()
        drone.up(s.options, () => {
            callSuccess()
        })
    } else if (s.method == 'down') {
        call()
        drone.down(s.options, () => {
            callSuccess()
        })
    } else if (s.method == 'turnRight') {
        call()
        drone.turnRight(s.options, () => {
            callSuccess()
        })
    } else if (s.method == 'turnLeft') {
        call()
        drone.turnLeft(s.options, () => {
            callSuccess()
        })
    } else if (s.method == 'forward') {
        call()
        drone.forward(s.options, () => {
            callSuccess()
        })
    } else if (s.method == 'backward') {
        call()
        drone.backward(s.options, () => {
            callSuccess()
        })
    } else if (s.method == 'left') {
        call()
        drone.left(s.options, () => {
            callSuccess()
        })
    } else if (s.method == 'right') {
        call()
        drone.right(s.options, () => {
            callback()
        })
    }
}
