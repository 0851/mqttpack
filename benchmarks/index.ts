import mqtt from 'mqtt-packet'
import { Decode, Decode3 } from '../src/decode'
import { Encode, Encode3 } from '../src/encode'
import { netTime, time } from './util'
const parser = mqtt.parser()

let x: any = {
  cmd: 'publish',
  qos: 1,
  messageId: 1020,
  dup: false,
  retain: false,
  topic: 'testtesttest',
  payload: Buffer.from(`testtesttesttesttest`)
}

let s3 = Buffer.from([
  50, 12, 0, 4, 116, 101, 115, 116, 3, 252, 116, 101, 115, 116
])
let s5 = Buffer.from([
  50, 13, 0, 4, 116, 101, 115, 116, 3, 252, 0, 116, 101, 115, 116
])

async function mqttEncode () {
  await time('mqtt-packet encode', (i) => {
    mqtt.generate(x as any, { protocolVersion: 5 })
  })
  await netTime('mqtt-packet encode', (dest, i) => {
    let a = mqtt.generate(x as any, { protocolVersion: 5 })
    dest.write(a)
  })
  await netTime('mqtt-packet stream encode', (dest, i) => {
    mqtt.writeToStream(x as any, dest, { protocolVersion: 5 })
  })
  await time('mqtt-packet encode3', (i) => {
    mqtt.generate(x as any)
  })
  await netTime('mqtt-packet encode3', (dest, i) => {
    let a = mqtt.generate(x as any)
    dest.write(a)
  })
  await netTime('mqtt-packet stream encode3', (dest, i) => {
    mqtt.writeToStream(x as any, dest)
  })
}
async function mqttDecode () {
  await time('mqtt-packet decode3', (i) => {
    parser.parse(s3)
  })
  await time('mqtt-packet decode', (i) => {
    parser.parse(s5, { protocolVersion: 5 })
  })
}

async function encode () {
  await time('encode', () => {
    Encode(x)
  })
  await time('encode3', () => {
    Encode3(x)
  })
  await netTime('encode', (dest, i) => {
    let a = Encode(x)
    dest.write(a)
  })
  await netTime('encode3', (dest, i) => {
    let a = Encode3(x)
    dest.write(a)
  })
}

async function decode () {
  await time('decode3', () => {
    Decode3(s3)
  })
  await time('decode', () => {
    Decode(s5)
  })
}

async function main () {
  await encode()
  await decode()
  await mqttEncode()
  await mqttDecode()
}

main()