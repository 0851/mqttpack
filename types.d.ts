/**
 * 名字	值	报文流动方向	描述
 * reserved	0	禁止	保留
 * connect	1	客户端到服务端	客户端请求连接服务端
 * connack	2	服务端到客户端	连接报文确认
 * publish	3	两个方向都允许	发布消息
 * puback	4	两个方向都允许	qos 1消息发布收到确认
 * pubrec	5	两个方向都允许	发布收到（保证交付第一步）
 * pubrel	6	两个方向都允许	发布释放（保证交付第二步）
 * pubcomp	7	两个方向都允许	qos 2消息发布完成（保证交互第三步）
 * subscribe	8	客户端到服务端	客户端订阅请求
 * suback	9	服务端到客户端	订阅请求报文确认
 * unsubscribe	10	客户端到服务端	客户端取消订阅请求
 * unsuback	11	服务端到客户端	取消订阅报文确认
 * pingreq	12	客户端到服务端	心跳请求
 * pingresp	13	服务端到客户端	心跳响应
 * disconnect	14	两个方向都允许	断开连接通知
 * auth	15	两个方向都允许	认证信息交换
 */

declare namespace MqttPacket {
  export type TypeControlTypes3 =
    'reserved' |//禁止	保留
    'connect' |//客户端到服务端	客户端请求连接服务端
    'connack' |//服务端到客户端	连接报文确认
    'publish' |//两个方向都允许	发布消息
    'puback' |//两个方向都允许	qos 1消息发布收到确认
    'pubrec' |//两个方向都允许	发布收到（保证交付第一步）
    'pubrel' |//两个方向都允许	发布释放（保证交付第二步）
    'pubcomp' |//两个方向都允许	qos 2消息发布完成（保证交互第三步
    'subscribe' |//客户端到服务端	客户端订阅请求
    'suback' |//服务端到客户端	订阅请求报文确认
    'unsubscribe' |//客户端到服务端	客户端取消订阅请求
    'unsuback' |//服务端到客户端	取消订阅报文确认
    'pingreq' |//客户端到服务端	心跳请求
    'pingresp' |//服务端到客户端	心跳响应
    'disconnect' //两个方向都允许	断开连接通知

  export type TypeControlTypes = TypeControlTypes3 | 'auth' ///两个方向都允许	认证信息交换

  export type TypeControlTypesMap<T extends (TypeControlTypes | TypeControlTypes3)> = {
    [key in T]: number
  }
  /**
  标识符	属性名	数据类型	报文/遗嘱属性
  Dec	Hex
  1	0x01	载荷格式说明	字节	PUBLISH, Will TypeProperties
  2	0x02	消息过期时间	四字节整数	PUBLISH, Will TypeProperties
  3	0x03	内容类型	UTF-8编码字符串	PUBLISH, Will TypeProperties
  8	0x08	响应主题	UTF-8编码字符串	PUBLISH, Will TypeProperties
  9	0x09	相关数据	二进制数据	PUBLISH, Will TypeProperties
  11	0x0B	定义标识符	变长字节整数	PUBLISH, SUBSCRIBE
  17	0x11	会话过期间隔	四字节整数	CONNECT, CONNACK, DISCONNECT
  18	0x12	分配客户标识符	UTF-8编码字符串	CONNACK
  19	0x13	服务端保活时间	双字节整数	CONNACK
  21	0x15	认证方法	UTF-8编码字符串	CONNECT, CONNACK, AUTH
  22	0x16	认证数据	二进制数据	CONNECT, CONNACK, AUTH
  23	0x17	请求问题信息	字节	CONNECT
  24	0x18	遗嘱延时间隔	四字节整数	Will TypeProperties
  25	0x19	请求响应信息	字节	CONNECT
  26	0x1A	请求信息	UTF-8编码字符串	CONNACK
  28	0x1C	服务端参考	UTF-8编码字符串	CONNACK, DISCONNECT
  31	0x1F	原因字符串	UTF-8编码字符串	CONNACK, PUBACK, PUBREC, PUBREL, PUBCOMP, SUBACK, UNSUBACK, DISCONNECT, AUTH
  33	0x21	接收最大数量	双字节整数	CONNECT, CONNACK
  34	0x22	主题别名最大长度	双字节整数	CONNECT, CONNACK
  35	0x23	主题别名	双字节整数	PUBLISH
  36	0x24	最大QoS	字节	CONNACK
  37	0x25	保留属性可用性	字节	CONNACK
  38	0x26	用户属性	UTF-8字符串对	CONNECT, CONNACK, PUBLISH, Will TypeProperties, PUBACK, PUBREC, PUBREL, PUBCOMP, SUBSCRIBE, SUBACK, UNSUBSCRIBE, UNSUBACK, DISCONNECT, AUTH
  39	0x27	最大报文长度	四字节整数	CONNECT, CONNACK
  40	0x28	通配符订阅可用性	字节	CONNACK
  41	0x29	订阅标识符可用性	字节	CONNACK
  42	0x2A	共享订阅可用性	字节	CONNACK
  */

  export type TypeProperties = {
    payloadFormatIndicator?: boolean,
    messageExpiryInterval?: number,
    contentType?: string,
    responseTopic?: string,
    correlationData?: Buffer,
    subscriptionIdentifier?: number,
    sessionExpiryInterval?: number,
    assignedClientIdentifier?: string,
    serverKeepAlive?: number,
    authenticationMethod?: string,
    authenticationData?: Buffer,
    requestProblemInformation?: boolean,
    willDelayInterval?: number,
    requestResponseInformation?: boolean,
    responseInformation?: string,
    serverReference?: string,
    reasonString?: string,
    receiveMaximum?: number,
    topicAliasMaximum?: number,
    topicAlias?: number,
    maximumQoS?: number,
    retainAvailable?: boolean,
    userProperties?: {
      [key: string]: string | string[]
    },
    maximumPacketSize?: number
    wildcardSubscriptionAvailable?: boolean
    subscriptionIdentifiersAvailable?: boolean
    sharedSubscriptionAvailable?: boolean
  }

  export type TypePropertiesKey = keyof TypeProperties
  export type TypePropertiesValue = TypeProperties[keyof TypeProperties]

  export type TypePropertiesKeys = {
    key: number,
    name: TypePropertiesKey
    format: 'utf8' | 'utf8pair' | 'byte' | 'byteInt4' | 'byteInt2' | 'varInt' | 'binaryData' | 'boolean'
  }
  export type TypePropertiesNameMap = {
    [key in TypePropertiesKey]: TypePropertiesKeys
  }
  export type TypePropertiesKeysMap = {
    [key: number]: TypePropertiesKeys
  }

  /**
  * 0	0x00	成功	CONNACK, PUBACK, PUBREC, PUBREL, PUBCOMP, UNSUBACK, AUTH
  0	0x00	正常断开	DISCONNECT
  0	0x00	授权的QoS 0	SUBACK
  1	0x01	授权的QoS 1	SUBACK
  2	0x02	授权的QoS 2	SUBACK
  4	0x04	包含遗嘱的断开	DISCONNECT
  16	0x10	无匹配订阅	PUBACK, PUBREC
  17	0x11	订阅不存在	UNSUBACK
  24	0x18	继续认证	AUTH
  25	0x19	重新认证	AUTH
  128	0x80	未指明的错误	CONNACK, PUBACK, PUBREC, SUBACK, UNSUBACK, DISCONNECT
  129	0x81	无效报文	CONNACK, DISCONNECT
  130	0x82	协议错误	CONNACK, DISCONNECT
  131	0x83	实现错误	CONNACK, PUBACK, PUBREC, SUBACK, UNSUBACK, DISCONNECT
  132	0x84	协议版本不支持	CONNACK
  133	0x85	客户标识符无效	CONNACK
  134	0x86	用户名密码错误	CONNACK
  135	0x87	未授权	CONNACK, PUBACK, PUBREC, SUBACK, UNSUBACK, DISCONNECT
  136	0x88	服务端不可用	CONNACK
  137	0x89	服务端正忙	CONNACK, DISCONNECT
  138	0x8A	禁止	CONNACK
  139	0x8B	服务端关闭中	DISCONNECT
  140	0x8C	无效的认证方法	CONNACK, DISCONNECT
  141	0x8D	保活超时	DISCONNECT
  142	0x8E	会话被接管	DISCONNECT
  143	0x8F	主题过滤器无效	SUBACK, UNSUBACK, DISCONNECT
  144	0x90	主题名无效	CONNACK, PUBACK, PUBREC, DISCONNECT
  145	0x91	报文标识符已被占用	PUBACK, PUBREC, SUBACK, UNSUBACK
  146	0x92	报文标识符无效	PUBREL, PUBCOMP
  147	0x93	接收超出最大数量	DISCONNECT
  148	0x94	主题别名无效	DISCONNECT
  149	0x95	报文过长	CONNACK, DISCONNECT
  150	0x96	消息太过频繁	DISCONNECT
  151	0x97	超出配额	CONNACK, PUBACK, PUBREC, SUBACK, DISCONNECT
  152	0x98	管理行为	DISCONNECT
  153	0x99	载荷格式无效	CONNACK, PUBACK, PUBREC, DISCONNECT
  154	0x9A	不支持保留	CONNACK, DISCONNECT
  155	0x9B	不支持的QoS等级	CONNACK, DISCONNECT
  156	0x9C	（临时）使用其他服务端	CONNACK, DISCONNECT
  157	0x9D	服务端已（永久）移动	CONNACK, DISCONNECT
  158	0x9E	不支持共享订阅	SUBACK, DISCONNECT
  159	0x9F	超出连接速率限制	CONNACK, DISCONNECT
  160	0xA0	最大连接时间	DISCONNECT
  161	0xA1	不支持订阅标识符	SUBACK, DISCONNECT
  162	0xA2	不支持通配符订阅	SUBACK, DISCONNECT
  */

  export type TypeReasonCodeCode =
    0x00 |
    0x00 |
    0x01 |
    0x02 |
    0x04 |
    0x10 |
    0x11 |
    0x18 |
    0x19 |
    0x80 |
    0x81 |
    0x82 |
    0x83 |
    0x84 |
    0x85 |
    0x86 |
    0x87 |
    0x88 |
    0x89 |
    0x8A |
    0x8B |
    0x8C |
    0x8D |
    0x8E |
    0x8F |
    0x90 |
    0x91 |
    0x92 |
    0x93 |
    0x94 |
    0x95 |
    0x96 |
    0x97 |
    0x98 |
    0x99 |
    0x9A |
    0x9B |
    0x9C |
    0x9D |
    0x9E |
    0x9F |
    0xA0 |
    0xA1 |
    0xA2

  export type TypeReasonCodeName =
    | 'success'
    | 'unspecifiedError'
    | 'malformedPacket'
    | 'protocolError'
    | 'implementationSpecificError'
    | 'unsupportedProtocolVersion'
    | 'clientIdentifierNotValid'
    | 'badUserNameOrPassword'
    | 'notAuthorized'
    | 'serverUnavailable'
    | 'serverBusy'
    | 'banned'
    | 'badAuthenticationMethod'
    | 'topicNameInvalid'
    | 'packetTooLarge'
    | 'quotaExceeded'
    | 'payloadFormatInvalid'
    | 'retainNotSupported'
    | 'qoSNotSupported'
    | 'useAnotherServer'
    | 'serverMoved'
    | 'connectionRateExceeded'
    | 'success'
    | 'noMatchingSubscribers'
    | 'unspecifiedError'
    | 'implementationSpecificError'
    | 'notAuthorized'
    | 'topicNameInvalid'
    | 'packetIdentifierInUse'
    | 'quotaExceeded'
    | 'payloadFormatInvalid'
    | 'success'
    | 'packetIdentifierNotFound'
    | 'grantedQoS0'
    | 'grantedQoS1'
    | 'grantedQoS2'
    | 'unspecifiedError'
    | 'implementationSpecificError'
    | 'notAuthorized'
    | 'topicFilterInvalid'
    | 'packetIdentifierInUse'
    | 'quotaExceeded'
    | 'sharedSubscriptionsNotSupported'
    | 'subscriptionIdentifiersNotSupported'
    | 'wildcardSubscriptionsNotSupported'
    | 'success'
    | 'noSubscriptionExisted'
    | 'unspecifiedError'
    | 'implementationSpecificError'
    | 'notAuthorized'
    | 'topicFilterInvalid'
    | 'packetIdentifierInUse'
    | 'normalDisconnection'
    | 'disconnectWithWillMessage'
    | 'unspecifiedError'
    | 'malformedPacket'
    | 'protocolError'
    | 'implementationSpecificError'
    | 'notAuthorized'
    | 'serverBusy'
    | 'serverShuttingDown'
    | 'keepAliveTimeout'
    | 'sessionTakenOver'
    | 'topicFilterInvalid'
    | 'topicNameInvalid'
    | 'receiveMaximumExceeded'
    | 'topicAliasInvalid'
    | 'packetTooLarge'
    | 'messageRateTooHigh'
    | 'quotaExceeded'
    | 'administrativeAction'
    | 'payloadFormatInvalid'
    | 'retainNotSupported'
    | 'qoSNotSupported'
    | 'useAnotherServer'
    | 'serverMoved'
    | 'sharedSubscriptionsNotSupported'
    | 'maximumConnectTime'
    | 'subscriptionIdentifiersNotSupported'
    | 'wildcardSubscriptionsNotSupported'
    | 'success'
    | 'continueAuthentication'
    | 'reAuthenticate'

  export type TypeReasonCode = {
    code: TypeReasonCodeCode
    name: TypeReasonCodeName
  };

  export type TypeTopicFilter = {
    topic: string,
    qos: 0 | 1 | 2 | 3 | number,
    nl: boolean,
    rap: boolean
    rh: 0 | 1 | 2 | 3 | number
  }

  export type VariableHeader = {
    messageId?: number // (PUBLISH && qos!=0) | PUBACK | PUBREC | PUBREL | PUBCOMP | SUBSCRIBE | SUBACK | UNSUBSCRIBE | UNSUBACK 需要填写
    protocolId?: 'MQIsdp' | 'MQTT' | string // cmd CONNECT, Encode 不填自动生成
    protocolVersion?: 3 | 4 | 5 | number  // cmd CONNECT Encode, 不填自动生成
    clean?: boolean // cmd CONNECT
    willFlag?: boolean // cmd CONNECT
    willQos?: number // cmd CONNECT
    willRetainFlag?: boolean // cmd CONNECT
    passwordFlag?: boolean // cmd CONNECT, payload 包含password 值为1 ,否则 0
    usernameFlag?: boolean// cmd CONNECT, payload 包含userName 值为1 ,否则 0
    keepalive?: number // cmd CONNECT ,不填默认0
    sessionPresent?: boolean, // cmd CONNACK, 不填默认0
    reasonCode?: number,// cmd CONNACK || (version5 && (PUBACK'| 'PUBREC'|'PUBREL'|'PUBCOMP' | 'DISCONNECT' | 'AUTH'))
    returnCode?: number,// cmd CONNACK || (version5 && (PUBACK'| 'PUBREC'|'PUBREL'|'PUBCOMP' | 'DISCONNECT' | 'AUTH'))
    topic?: string // PUBLISH
  }

  export type TypeHeader<T = TypeControlTypes> = {
    cmd: T, // TypeControlTypes | TypeControlTypes3
    length?: number // Encode 时 不需要指定
    dup?: boolean  // cmd PUBLISH
    qos?: 0 | 1 | 2 | 3 | number // cmd PUBLISH
    retain?: boolean  // cmd PUBLISH
  }
  export type TypeWill = {
    topic?: string// cmd CONNECT
    payload?: Buffer //cmd CONNECT
    properties?: TypeProperties // cmd CONNECT && version5
  }
  export type TypePayload = {
    clientId?: string // cmd CONNECT
    will?: TypeWill
    username?: string // cmd CONNECT
    password?: Buffer // cmd CONNECT
    payload?: string | Buffer // cmd PUBLISH
    subscriptions?: TypeTopicFilter[] //SUBSCRIBE
    granted?: number[] // cmd SUBACK || (cmd UNSUBACK && version5)
    //subscribeReasonCodes version 5 可以是预定义的 type TypeReasonCodeName 中字符串 ,也可以是255内 数字, version 3必须为数字
    unsubscriptions?: string[] // cmd UNSUBSCRIBE
  }

  export type TypePacket = TypeHeader & VariableHeader & TypePayload & {
    properties?: TypeProperties
  }

  export type TypePacket3 = TypeHeader<TypeControlTypes3> & VariableHeader & TypePayload

  export type TypeVersion = 3 | 5

  export interface InterfaceDecodeMethod {
    peek (): number | undefined
    peekMultiple (len?: number): Buffer
    index (): number
    multiple (len?: number): Buffer
    multipleForce (len: number): Buffer
    readForce (): number
    read (): number | undefined
    readUInt16BE (): number
    readUInt32BE (): number
    readVarInt (max?: number): number
    readUTF8 (): string
  }

  export type TypeEncodeData = {
    type: 'varint' | 'uint16'
    | 'uint32' | 'utf8'
    | 'byte' | 'binaryData'
    value: number | string | Buffer | number[]
    len: number
  }

  export interface InterfaceEncodeMethod {
    bodies: TypeEncodeData[]
    result (header: number): Buffer
    byteLength (): number
    body (): TypeEncodeData[]
    writeVarIntAsArray (n: number, max?: number): number[]
    writeVarInt (n: number, max?: number): void
    writeUInt16BE (n: number): void
    writeUInt32BE (n: number): void
    writeUTF8 (str: string): void
    writeUTF8NoLength (str: string): void
    writeByte (n: number): void
    writeBinaryData (buf: Buffer): void
    push (value: TypeEncodeData): void
    concat (values: TypeEncodeData[]): void
  }
}

declare function Encode (packet: MqttPacket.TypePacket): Buffer
declare function Encode3 (packet: MqttPacket.TypePacket3): Buffer
declare function Decode3 (buf: Buffer): MqttPacket.TypePacket3
declare function Decode (buf: Buffer): MqttPacket.TypePacket
declare function FindReasonCodeName (cmd: MqttPacket.TypeControlTypes, code: number): MqttPacket.TypeReasonCodeName
declare function FindReasonCode (cmd: MqttPacket.TypeControlTypes, name: string): MqttPacket.TypeReasonCodeCode