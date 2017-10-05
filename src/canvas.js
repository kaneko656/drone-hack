window.addEventListener('load', init, false)

function init() {
    let element = document.getElementById('content')
    console.log(element)
    var canvas = document.createElement('canvas')
    let width = window.innerWidth > 300 ? window.innerWidth : 300
    let height = window.innerHeight > 300 ? window.innerHeight : 300
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    element.appendChild(canvas)


    let myBot = require('./../exCall-module/exBot')({
        team: 'keitalab',
        pass: '1108'
    })


    myBot.connect((exBot) => {
        let refreshTime = 30
        let lastTime = 0
        canvas.addEventListener('mousemove', (e) => {
            if (Date.now() - lastTime < refreshTime) {
                return
            }
            lastTime = Date.now()
            let x = e.clientX / canvas.width - 0.5
            let y = e.clientY / canvas.height - 0.5
            console.log(x, y)
            exBot.emit('test/drone', {
                x: x,
                y: y
            })

        })
        canvas.addEventListener('touchmove', (e) => {
            if (Date.now() - lastTime < refreshTime) {
                return
            }
            lastTime = Date.now()
            var x = e.touches[0].pageX / window.innerWidth - 0.5
            var y = e.touches[0].pageY / window.innerHeight - 0.5
            console.log(x, y)
            exBot.emit('test/drone', {
                x: x,
                y: y
            })

        })
    })
}
