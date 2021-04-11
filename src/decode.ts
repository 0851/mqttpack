import {
  ControlTypesList,
  decodeFlag,
  HasProperties, ControlTypesList3,
  PropertiesKeyNames, PropertiesKeysMap,
} from './constants';
import {
  contactLow,
  getHight, getLow,
  getOffset, DecodeMethod
} from './util';


function genFixedHeader<V extends MqttPacket.TypeVersion,
  R = MqttPacket.TypeHeader<V extends 5 ? MqttPacket.TypeControlTypes : MqttPacket.TypeControlTypes3>>
  (d: DecodeMethod, v: V): R {
  let one = d.readForce()
  let height = getHight(one)
  let low = getLow(one)
  let cmd: MqttPacket.TypeControlTypes | MqttPacket.TypeControlTypes3 | undefined
  if (v === 3) {
    cmd = ControlTypesList3[height]
  } else {
    cmd = ControlTypesList[height]
  }
  if (!cmd) {
    throw new Error('The types of TypePacket does not support')
  }
  let { qos, dup, retain } = decodeFlag(low)
  let length = d.readVarInt(4)
  if (length !== d.peekMultiple().length) { //长度不匹配
    throw new Error('TypePacket length not match')
  }
  return {
    length,
    cmd,
    qos,
    dup,
    retain
  } as unknown as R
}

/**
 *
 * @param header
 * @param buf
 * @param d
 * @returns TypeProperties
 **/

function genProperties<V extends MqttPacket.TypeVersion>
  (d: DecodeMethod, cmd: MqttPacket.TypeControlTypes | MqttPacket.TypeControlTypes3, v: V):
  MqttPacket.TypeProperties | undefined {
  if (v === 3 || HasProperties.indexOf(cmd) < 0) {
    return
  }
  let length = d.readVarInt()
  if (!length) {
    return
  }
  let result: MqttPacket.TypeProperties = {}
  let sub = new DecodeMethod(d.multipleForce(length))
  while (sub.peek() !== undefined) {
    let key = sub.readForce()
    let find = PropertiesKeysMap[key]
    if (!find) {
      throw new Error(`TypeProperties decode error, Does not support properties ${key} only ${PropertiesKeyNames.join(', ')}`)
    }
    if (find.format === 'utf8') {
      Object.assign(result, {
        [find.name]: sub.readUTF8()
      })
    }
    if (find.format === 'utf8pair') {
      let key = sub.readUTF8()
      let value = sub.readUTF8()
      let old = result[find.name]
      if (typeof old === 'object'
        && old !== null
        && !(old instanceof Buffer)) {
        let inner = old[key]
        if (Array.isArray(inner)) {
          inner.push(value)
        } else if (typeof inner === 'string') {
          old[key] = [inner, value]
        } else {
          old[key] = value
        }
      } else {
        old = {
          [key]: value
        }
      }
      Object.assign(result, {
        [find.name]: old
      })
    }
    if (find.format === 'byte') {
      Object.assign(result, {
        [find.name]: sub.readForce()
      })
    }
    if (find.format === 'boolean') {
      Object.assign(result, {
        [find.name]: !!sub.readForce()
      })
    }
    if (find.format === 'byteInt4') {
      Object.assign(result, {
        [find.name]: sub.readUInt32BE()
      })
    }
    if (find.format === 'byteInt2') {
      Object.assign(result, {
        [find.name]: sub.readUInt16BE()
      })
    }
    if (find.format === 'varInt') {
      Object.assign(result, {
        [find.name]: sub.readVarInt()
      })
    }
    if (find.format === 'binaryData') {
      Object.assign(result, {
        [find.name]: sub.readBinaryBuf()
      })
    }
  }
  return result
}

function genPayload<V extends MqttPacket.TypeVersion> (
  d: DecodeMethod,
  header: MqttPacket.TypeHeader,
  variableHeader: MqttPacket.VariableHeader | undefined,
  v: V
): MqttPacket.TypePayload | undefined {
  let one = d.peek()
  let cmd = header.cmd
  if (one === undefined) {
    return
  }
  let payload: MqttPacket.TypePayload = {}
  if (cmd === 'connect') {
    payload.clientId = d.readUTF8()
    if (variableHeader?.willFlag) {
      let will: MqttPacket.TypeWill = {}
      if (v === 5) {
        will.properties = genProperties(d, cmd, v)
      }
      will.topic = d.readUTF8()
      will.payload = d.readBinaryBuf()
      payload.will = will
    }
    if (variableHeader?.usernameFlag) {
      payload.username = d.readUTF8()
    }
    if (variableHeader?.passwordFlag) {
      payload.password = d.readBinaryBuf()
    }
  }
  if (cmd === 'publish') {
    payload.payload = d.multiple()
  }
  if (cmd === 'subscribe') {
    let subscriptions: MqttPacket.TypeTopicFilter[] = []
    while (d.peek() !== undefined) {
      let topic = d.readUTF8()
      let option = d.readForce()
      let qos = contactLow(getOffset(option, 1), getOffset(option, 0), 2)
      let nl = false
      let rap = false
      let rh = 0
      if (v === 5) {
        nl = !!getOffset(option, 2)
        rap = !!getOffset(option, 3)
        rh = contactLow(getOffset(option, 5), getOffset(option, 4), 2)
      }
      subscriptions.push({
        topic,
        qos: qos as (0 | 1 | 2 | 3),
        nl,
        rap,
        rh: rh as (0 | 1 | 2 | 3)
      })
    }
    payload.subscriptions = subscriptions
  }
  if (cmd === 'suback' || (v === 5 && cmd === 'unsuback')) {
    let granted: number[] = []
    while (d.peek() !== undefined) {
      granted.push(d.readForce())
    }
    payload.granted = granted
  }
  if (cmd === 'unsubscribe') {
    let unsubscriptions: string[] = []
    while (d.peek() !== undefined) {
      unsubscriptions.push(d.readUTF8())
    }
    payload.unsubscriptions = unsubscriptions
  }
  return payload
}

function CONNECTVariableHeader<V extends MqttPacket.TypeVersion>
  (d: DecodeMethod, v: V): MqttPacket.VariableHeader {
  let protocolId = d.readUTF8()
  if (protocolId !== 'MQTT' && protocolId !== 'MQIsdp') {
    throw new Error('Protocol Name error')
  }
  let protocolVersion = d.readForce() as 4 | 5 | 3
  if (v === 5 && protocolVersion !== 5) {
    throw new Error('Protocol Version must 5')
  }
  if (v === 3 && (protocolVersion !== 4 && protocolVersion !== 3)) {
    throw new Error('Protocol Version must 4 | 3')
  }
  let flag = d.readForce()
  let reserved = getOffset(flag, 0)
  if (reserved !== 0) {
    throw new Error('Reserved must be 0')
  }
  let clean = !!getOffset(flag, 1)
  let willFlag = !!getOffset(flag, 2)
  let willQos = contactLow(getOffset(flag, 3), getOffset(flag, 4), 2)
  let willRetainFlag = !!getOffset(flag, 5)
  let passwordFlag = !!getOffset(flag, 6)
  let usernameFlag = !!getOffset(flag, 7)
  let keepalive = d.readUInt16BE()
  return {
    protocolId,
    protocolVersion,
    clean,
    willFlag,
    willQos,
    willRetainFlag,
    passwordFlag,
    usernameFlag,
    keepalive
  }
}
function genVariableHeader<V extends MqttPacket.TypeVersion>
  (d: DecodeMethod, header: MqttPacket.TypeHeader, v: V):
  MqttPacket.VariableHeader | undefined {
  if (d.peek() === undefined) {
    return
  }
  let cmd = header.cmd
  let variableHeader: MqttPacket.VariableHeader = {}

  if (cmd === 'connect') {
    return CONNECTVariableHeader(d, v)
  }
  if (cmd === "connack") {
    let connectAcknowledgeFlags = d.readForce()
    variableHeader.sessionPresent = !!getOffset(connectAcknowledgeFlags, 0)
    let code = d.readForce()
    variableHeader.reasonCode = code
    variableHeader.returnCode = code
    return variableHeader
  }
  if (cmd === 'publish') {
    variableHeader.topic = d.readUTF8()
    if (header.qos === 1 || header.qos === 2) {
      variableHeader.messageId = d.readUInt16BE()
    }
    return variableHeader
  }
  if (['puback', 'pubrec', 'pubrel', 'pubcomp'].indexOf(cmd) >= 0) {
    variableHeader.messageId = d.readUInt16BE()
    if (v === 5) {
      let code = d.readForce()
      variableHeader.reasonCode = code
      variableHeader.returnCode = code
    }
    return variableHeader
  }
  if (['subscribe', 'suback', 'unsubscribe', 'unsuback'].indexOf(cmd) >= 0) {
    variableHeader.messageId = d.readUInt16BE()
    return variableHeader
  }
  if (['disconnect', 'auth'].indexOf(cmd) >= 0 && v === 5) {
    let code = d.readForce()
    variableHeader.reasonCode = code
    variableHeader.returnCode = code
    return variableHeader
  }
}

export function Decode (buf: Buffer): MqttPacket.TypePacket {
  let d = new DecodeMethod(buf)
  let header = genFixedHeader(d, 5)
  let variableHeader = genVariableHeader(d, header, 5)
  let properties = genProperties(d, header.cmd, 5)
  let payload = genPayload(d, header, variableHeader, 5)
  return {
    ...header,
    ...variableHeader,
    ...payload,
    properties,
  }
}

export function Decode3 (buf: Buffer): MqttPacket.TypePacket3 {
  let d = new DecodeMethod(buf)
  let header = genFixedHeader(d, 3)
  let variableHeader = genVariableHeader(d, header, 3)
  let payload = genPayload(d, header, variableHeader, 3)
  return {
    ...header,
    ...variableHeader,
    ...payload
  }
}
