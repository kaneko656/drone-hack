let counter = 0

exports.on = (log) => {
    // if (typeof log != 'object') {
    //     console.log('[' + counter + ']', log)
    // }
    if (typeof log == 'string') {
        if (log.indexOf('Battery level: ') >= 0) {
            log = log.replace('Battery level: ', '')
            log = log.replace('%', '')
            let batteryLevel = log
            console.log('Battery level: ', batteryLevel)
        }
        if (log.indexOf('Flying status') >= 0) {

        } else {
            console.log('[' + counter + ']', log)
        }
    }

    counter++
}
