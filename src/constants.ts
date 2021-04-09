export const PropertiesKeys: MqttPacket.TypePropertiesKeys[] = [
  {
    key: 0x01,
    name: 'payloadFormatIndicator',
    format: 'boolean'
  }, {
    key: 0x02,
    name: 'messageExpiryInterval',
    format: 'byteInt4'
  }, {
    key: 0x03,
    name: 'contentType',
    format: 'utf8'
  }, {
    key: 0x08,
    name: 'responseTopic',
    format: 'utf8'
  }, {
    key: 0x09,
    name: 'correlationData',
    format: 'binaryData'
  }, {
    key: 0x0B,
    name: 'subscriptionIdentifier',
    format: 'varInt'
  }, {
    key: 0x11,
    name: 'sessionExpiryInterval',
    format: 'byteInt4'
  }, {
    key: 0x12,
    name: 'assignedClientIdentifier',
    format: 'utf8'
  }, {
    key: 0x13,
    name: 'serverKeepAlive',
    format: 'byteInt2'
  }, {
    key: 0x15,
    name: 'authenticationMethod',
    format: 'utf8'
  }, {
    key: 0x16,
    name: 'authenticationData',
    format: 'binaryData'
  }, {
    key: 0x17,
    name: 'requestProblemInformation',
    format: 'boolean'
  }, {
    key: 0x18,
    name: 'willDelayInterval',
    format: 'byteInt4'
  }, {
    key: 0x19,
    name: 'requestResponseInformation',
    format: 'boolean'
  }, {
    key: 0x1A,
    name: 'responseInformation',
    format: 'utf8'
  }, {
    key: 0x1C,
    name: 'serverReference',
    format: 'utf8'
  }, {
    key: 0x1F,
    name: 'reasonString',
    format: 'utf8'
  }, {
    key: 0x21,
    name: 'receiveMaximum',
    format: 'byteInt2'
  }, {
    key: 0x22,
    name: 'topicAliasMaximum',
    format: 'byteInt2'
  }, {
    key: 0x23,
    name: 'topicAlias',
    format: 'byteInt2'
  }, {
    key: 0x24,
    name: 'maximumQoS',
    format: 'byte'
  }, {
    key: 0x25,
    name: 'retainAvailable',
    format: 'boolean'
  }, {
    key: 0x26,
    name: 'userProperties',
    format: 'utf8pair'
  }, {
    key: 0x27,
    name: 'maximumPacketSize',
    format: 'byteInt4'
  }, {
    key: 0x28,
    name: 'wildcardSubscriptionAvailable',
    format: 'boolean'
  }, {
    key: 0x29,
    name: 'subscriptionIdentifiersAvailable',
    format: 'boolean'
  }, {
    key: 0x2A,
    name: 'sharedSubscriptionAvailable',
    format: 'boolean'
  }
]
export const PropertiesKeyNames = PropertiesKeys.map((item) => {
  return item.name
})

export const PropertiesNamesMap = PropertiesKeys.reduce((res, item) => {
  Object.assign(res, {
    [item.name]: item
  })
  return res
}, {} as MqttPacket.TypePropertiesNameMap)

export const PropertiesKeysMap = PropertiesKeys.reduce((res, item) => {
  Object.assign(res, {
    [item.key]: item
  })
  return res
}, {} as MqttPacket.TypePropertiesKeysMap)

export const ControlTypesNames3: MqttPacket.TypeControlTypesMap<MqttPacket.TypeControlTypes3> = {
  'reserved': 0,//禁止	保留
  'connect': 1,//客户端到服务端	客户端请求连接服务端
  'connack': 2,//服务端到客户端	连接报文确认
  'publish': 3,//两个方向都允许	发布消息
  'puback': 4,//两个方向都允许	qos 1消息发布收到确认
  'pubrec': 5,//两个方向都允许	发布收到（保证交付第一步）
  'pubrel': 6,//两个方向都允许	发布释放（保证交付第二步）
  'pubcomp': 7,//两个方向都允许	qos 2消息发布完成（保证交互第三步
  'subscribe': 8,//客户端到服务端	客户端订阅请求
  'suback': 9,//服务端到客户端	订阅请求报文确认
  'unsubscribe': 10,//客户端到服务端	客户端取消订阅请求
  'unsuback': 11,//服务端到客户端	取消订阅报文确认
  'pingreq': 12,//客户端到服务端	心跳请求
  'pingresp': 13,//服务端到客户端	心跳响应
  'disconnect': 14,//两个方向都允许	断开连接通知
}

export const ControlTypesNames: MqttPacket.TypeControlTypesMap<MqttPacket.TypeControlTypes> = {
  ...ControlTypesNames3,
  'auth': 15//两个方向都允许	认证信息交换
}

export const ControlTypesList: MqttPacket.TypeControlTypes[] = Object.keys(ControlTypesNames) as MqttPacket.TypeControlTypes[]
export const ControlTypesList3: MqttPacket.TypeControlTypes3[] = Object.keys(ControlTypesNames3) as MqttPacket.TypeControlTypes3[]

/**
 *  控制报文	固定报头标志	Bit 3	Bit 2	Bit 1	Bit 0
 *  CONNECT	Reserved	0	0	0	0
 *  CONNACK	Reserved	0	0	0	0
 *  PUBLISH	Used in MQTT v5.0	DUP	QoS	RETAIN
 *  PUBACK	Reserved	0	0	0	0
 *  PUBREC	Reserved	0	0	0	0
 *  PUBREL	Reserved	0	0	1	0
 *  PUBCOMP	Reserved	0	0	0	0
 *  SUBSCRIBE	Reserved	0	0	1	0
 *  SUBACK	Reserved	0	0	0	0
 *  UNSUBSCRIBE	Reserved	0	0	1	0
 *  UNSUBACK	Reserved	0	0	0	0
 *  PINGREQ	Reserved	0	0	0	0
 *  PINGRESP	Reserved	0	0	0	0
 *  DISCONNECT	Reserved	0	0	0	0
 *  AUTH	Reserved	0	0	0	0
 *  DUP1 =控制报文的重复分发标志
 *  QoS2 = PUBLISH报文的服务质量等级
 *  RETAIN3 = PUBLISH报文的保留标志 PUBLISH控制报文中的DUP, QoS和RETAIN标志
 */
export const encodeFlag = function (
  control: MqttPacket.TypeControlTypes,
  dup?: boolean, // 0|1
  qos?: 0 | 1 | 2 | 3 | number,
  retain?: boolean// 0|1|2
): number {
  if (control === 'publish') {
    let d = dup ? 1 : 0
    if (qos !== 0 && qos !== 1 && qos !== 2) {
      throw new Error('qos must be 0 | 1 | 2')
    }
    let r = retain ? 1 : 0
    return d << 3 | qos << 1 | r;
  }
  if (control === 'pubrel' || control === 'subscribe' || control === 'unsubscribe') {
    return 2//0010;
  }
  return 0
}

export function decodeFlag (n: number): {
  qos: 0 | 1 | 2 | 3 | number,
  dup: boolean,
  retain: boolean
} {
  let qos = (n >> 1) & 3
  let retain = n & 1;
  let dup = n >> 3;
  if (dup !== 0 && dup !== 1) {
    throw new Error('dup must be 0 | 1')
  }
  if (qos !== 0 && qos !== 1 && qos !== 2) {
    throw new Error('qos must be 0 | 1 | 2')
  }
  return {
    dup: !!dup,
    qos: qos,
    retain: !!retain,
  }
}

export const HasProperties: MqttPacket.TypeControlTypes[] = [
  'connect',
  'connack',
  'publish',
  'pubrel',
  'puback',
  'pubrec',
  'pubcomp',
  'subscribe',
  'suback',
  'unsubscribe',
  'unsuback',
  'disconnect',
  'auth'
]

export const HasPayloadCMD3: MqttPacket.TypeControlTypes3[] = ['connect', 'subscribe', 'suback', 'unsubscribe']

export const HasPayloadCMD: MqttPacket.TypeControlTypes[] = [...HasPayloadCMD3, 'unsuback']
