var mqttpack = require('../dist/node.min.js')
var hex = mqttpack.Encode({
  cmd: 'publish',
  qos: 1,
  messageId: 1020,
  dup: false,
  retain: false,
  topic: 'testtesttest',
  payload: 'testtesttesttesttest'
})
console.log(hex.toString('hex'))
console.log(mqttpack.Decode(hex))