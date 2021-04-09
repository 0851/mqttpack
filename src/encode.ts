import {
  ControlTypesNames,
  ControlTypesNames3,
  encodeFlag,
  HasProperties,
  PropertiesKeyNames,
  PropertiesNamesMap
} from './constants';
import {
  contactLow,
  validBit,
  EncodeMethod
} from './util';

function encodeFixedHeader
  (packet: MqttPacket.TypePacket | MqttPacket.TypePacket3, v: MqttPacket.TypeVersion): number {
  let num: number | undefined
  if (v === 3) {
    num = ControlTypesNames3[packet.cmd as MqttPacket.TypeControlTypes3]
  } else {
    num = ControlTypesNames[packet.cmd as MqttPacket.TypeControlTypes]
  }
  if (num === undefined) {
    throw new Error('The types of TypePacket does not support')
  }
  let qos = packet.qos ? packet.qos : 0
  let retain = packet.retain ? packet.retain : 0
  let flag = encodeFlag(packet.cmd, !!packet.dup, qos, !!retain)
  return contactLow(num, flag, 4)
}

function encodeVariableHeader (e: EncodeMethod,
  packet: MqttPacket.TypePacket | MqttPacket.TypePacket3,
  v: MqttPacket.TypeVersion
) {
  let cmd = packet.cmd
  if (cmd === 'connect') {
    let protocolId = packet.protocolId || 'MQTT'
    if (protocolId !== 'MQTT' && protocolId !== 'MQIsdp') {
      throw new Error('Protocol Name error')
    }
    let protocolVersion = packet.protocolVersion || (v === 5 ? 5 : 4)
    if (v === 5 && protocolVersion !== 5) {
      throw new Error('Protocol Version must 5')
    }
    if (v === 3 && (protocolVersion !== 4 && protocolVersion !== 3)) {
      throw new Error('Protocol Version must 4 | 3')
    }

    e.writeUTF8(protocolId)
    e.writeByte(protocolVersion)

    let o = {
      usernameFlag: packet.username ? 1 : 0,
      passwordFlag: packet.password ? 1 : 0,
      willRetainFlag: packet.willRetainFlag ? 1 : 0,
      willQos: packet.willQos ? 1 : 0,
      willFlag: packet.will ? 1 : 0,
      clean: packet.clean ? 1 : 0,
    }

    validBit('willQos', o, 2)
    validBit('usernameFlag', o)
    validBit('passwordFlag', o)
    validBit('willRetainFlag', o)
    validBit('willFlag', o)
    validBit('clean', o)

    let flag = o.usernameFlag << 7
      | o.passwordFlag << 6
      | o.willRetainFlag << 5
      | o.willQos << 3
      | o.willFlag << 2
      | o.clean << 1

    e.writeByte(flag)
    e.writeUInt16BE(packet.keepalive || 0)
  }
  if (cmd === 'connack') {
    e.writeByte(packet.sessionPresent ? 1 : 0)
    e.writeByte(packet.returnCode || packet.reasonCode || 0)
  }
  if (cmd === 'publish') {
    if (packet.topic === undefined) {
      throw new Error('topic must be set')
    }
    e.writeUTF8(packet.topic)
    if (packet.qos === 1
      || packet.qos === 2) {
      if (packet.messageId === undefined) {
        throw new Error('must be set messageId')
      }
      e.writeUInt16BE(packet.messageId)
    }
  }
  if (['puback', 'pubrec', 'pubrel', 'pubcomp'].includes(cmd)) {
    if (packet.messageId === undefined) {
      throw new Error('must be set messageId')
    }
    e.writeUInt16BE(packet.messageId)
    if (v === 5) {
      e.writeByte(packet.returnCode || packet.reasonCode || 0)
    }
  }
  if (['subscribe', 'suback', 'unsubscribe', 'unsuback'].includes(cmd)) {
    if (packet.messageId === undefined) {
      throw new Error('must be set messageId')
    }
    e.writeUInt16BE(packet.messageId)
  }
  if (['disconnect', 'auth'].includes(cmd) && v === 5) {
    e.writeByte(packet.returnCode || packet.reasonCode || 0)
  }
}
function writeUtf8pair (s: EncodeMethod, k1: number, key: string, v: string) {
  s.writeByte(k1)
  s.writeUTF8(key)
  s.writeUTF8(v)
}
function encodeUtf8pair (s: EncodeMethod,
  find: MqttPacket.TypePropertiesKeys,
  v: MqttPacket.TypeProperties[keyof MqttPacket.TypeProperties]) {
  if (!(find.format === 'utf8pair'
    && typeof v === 'object'
    && v !== null
    && !(v instanceof Buffer))) {
    return
  }
  let keys = Object.keys(v)
  let itemKey
  while (itemKey = keys.shift()) {
    const item = v[itemKey]
    if (Array.isArray(item)) {
      for (let index = 0, len = item.length; index < len; index++) {
        const element = item[index];
        writeUtf8pair(s, find.key, itemKey, element)
      }
    }
    if (typeof item === 'string') {
      writeUtf8pair(s, find.key, itemKey, item)
    }
  }
}

function encodeProperties (e: EncodeMethod,
  sub: EncodeMethod,
  packet: MqttPacket.TypePacket | MqttPacket.TypePacket3,
  properties: MqttPacket.TypeProperties | undefined,
  v: MqttPacket.TypeVersion) {
  if (v === 3 || !HasProperties.includes(packet.cmd)) {
    return
  }
  if (properties === undefined) {
    e.writeByte(0)
    return
  }
  let keys = Object.keys(properties)
  for (let index = 0, len = keys.length; index < len; index++) {
    const name = keys[index] as MqttPacket.TypePropertiesKey;
    const v = properties[name];
    let find = PropertiesNamesMap[name]
    if (!find) {
      throw new Error(`TypeProperties encode error, Does not support properties ${name} only ${PropertiesKeyNames.join(', ')}`)
    }
    if (find.format === 'utf8' && typeof v === 'string') {
      sub.writeByte(find.key)
      sub.writeUTF8(v)
    }
    encodeUtf8pair(sub, find, v)
    if (find.format === 'byte' && typeof v === 'number') {
      sub.writeByte(find.key)
      sub.writeByte(v)
    }
    if (find.format === 'boolean' && typeof v === 'boolean') {
      sub.writeByte(find.key)
      sub.writeByte(v ? 1 : 0)
    }
    if (find.format === 'byteInt4' && typeof v === 'number') {
      sub.writeByte(find.key)
      sub.writeUInt32BE(v)
    }
    if (find.format === 'byteInt2' && typeof v === 'number') {
      sub.writeByte(find.key)
      sub.writeUInt16BE(v)
    }
    if (find.format === 'varInt' && typeof v === 'number') {
      sub.writeByte(find.key)
      sub.writeVarInt(v)
    }
    if (find.format === 'binaryData' && v instanceof Buffer) {
      sub.writeByte(find.key)
      sub.writeBinaryData(v)
    }
  }
  e.writeVarInt(sub.byteLength())
  e.concat(sub.body())
  sub.bodies = []
}
function encodePayload (e: EncodeMethod, sub: EncodeMethod, packet: MqttPacket.TypePacket3 | MqttPacket.TypePacket,
  v: MqttPacket.TypeVersion) {
  let cmd = packet.cmd

  if (cmd === 'connect') {
    if (!packet.clientId) {
      throw new Error('payload.clientId must be set')
    }
    e.writeUTF8(packet.clientId)
    let will = packet.will
    if (will !== undefined) {
      if (v === 5) {
        encodeProperties(e, sub, packet, will.properties, v)
      }
      e.writeUTF8(will.topic || '')
      e.writeBinaryData(will.payload)
    }
    if (packet.username) {
      e.writeUTF8(packet.username)
    }
    if (packet.password) {
      e.writeBinaryData(packet.password)
    }
  }
  if (cmd === 'publish') {
    if (packet.payload instanceof Buffer) {
      e.writeBinaryDataNoLength(packet.payload)
    }
    if (typeof packet.payload === 'string') {
      e.writeUTF8NoLength(packet.payload)
    }
  }
  if (cmd === 'subscribe') {
    let subscriptions = packet.subscriptions || []
    for (let index = 0, len = subscriptions.length; index < len; index++) {
      const filter = subscriptions[index];
      if (!filter.topic) {
        throw new Error('topic must be set')
      }
      e.writeUTF8(filter.topic)
      let o = {
        rh: 0,
        rap: 0,
        nl: 0,
        qos: filter.qos || 0,
      }
      validBit('qos', o, 2)
      if (v === 5) {
        o.rh = filter.rh ? 1 : 0
        o.rap = filter.rap ? 1 : 0
        o.nl = filter.nl ? 1 : 0
        validBit('rh', o)
        validBit('rap', o)
        validBit('nl', o)
      }
      let option = o.rh << 4
        | o.rap << 3
        | o.nl << 2
        | o.qos
      e.writeByte(option)
    }
  }
  if (cmd === 'suback' || (cmd === 'unsuback' && v === 5)) {
    let granted = packet.granted || []
    for (let index = 0, len = granted.length; index < len; index++) {
      const element = granted[index];
      e.writeByte(element)
    }
  }
  if (cmd === 'unsubscribe') {
    let unsubscriptions = packet.unsubscriptions || []
    let len = unsubscriptions.length
    for (let index = 0; index < len; index++) {
      const element = unsubscriptions[index];
      e.writeUTF8(element)
    }
  }
}

export function Encode (packet: MqttPacket.TypePacket): Buffer {
  let e = new EncodeMethod()
  let sub = new EncodeMethod();
  let header = encodeFixedHeader(packet, 5)
  encodeVariableHeader(e, packet, 5)
  encodeProperties(e, sub, packet, packet.properties, 5)
  encodePayload(e, sub, packet, 5)
  let r = e.result(header)
  return r
}
export function Encode3 (packet: MqttPacket.TypePacket3): Buffer {
  let e = new EncodeMethod()
  let sub = new EncodeMethod();
  let header = encodeFixedHeader(packet, 3)
  encodeVariableHeader(e, packet, 3)
  encodePayload(e, sub, packet, 3)
  let r = e.result(header)
  return r
}