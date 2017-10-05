const express = require('express')
let defaultPort = 8000

let app = express()
let server = app.listen(defaultPort, function() {
    console.log('start server listening  http://localhost:' + defaultPort)
})
app.use(express.static(__dirname + '/src'))
