# MQTT 封包解包
- 无依赖
- ie10+ ,chrome, firefox ...
- node v4.0.0 以上
- MQTT3.1.1
- MQTT5
- TypeScript
- 完善的单元测试, 完全对照协议文档
- from
   - [MQTT Version 5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901079)
   - [MQTT协议5.0中文版](http://mqtt.p2hp.com/mqtt-5-0)
   - [MQTT Version 3.1.1](http://mqtt.p2hp.com/mqtt311)

- 包格式兼容大致兼容 [mqtt-packet](https://github.com/mqttjs/mqtt-packet)

## 构建包说明
```
dist
├── browser.min.js # 浏览器使用
├── browser.min.js.map
├── node.v4.min.js # node v4-v5使用
├── node.v4.min.js.map
├── node.v6.min.js # node v6 以上使用
├── node.v6.min.js.map
├── reasoncode.min.js  # 错误码, 可不使用 
└── reasoncode.min.js.map
```

## 安装
```
npm install mqttpack
# or
yarn add mqttpack
```
## 包格式
```typescript
type TypePacket3 = {
    cmd: TypeControlTypes | TypeControlTypes3, // 
    length?: number // Encode 时 不需要指定
    dup?: boolean  // cmd PUBLISH
    qos?: 0 | 1 | 2 | 3 | number // cmd PUBLISH
    retain?: boolean  // cmd PUBLISH
    clientId?: string // cmd CONNECT
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
    will?: {
      topic?: string// cmd CONNECT
      payload?: Buffer //cmd CONNECT
      properties?: TypeProperties // cmd CONNECT && version5
    }
    username?: string // cmd CONNECT
    password?: Buffer // cmd CONNECT
    payload?: string | Buffer // cmd PUBLISH
    subscriptions?: TypeTopicFilter[] //SUBSCRIBE
    granted?: number[] // cmd SUBACK || (cmd UNSUBACK && version5)
    //subscribeReasonCodes version 5 可以是预定义的 type TypeReasonCodeName 中字符串 ,也可以是255内 数字, version 3必须为数字
    unsubscriptions?: string[] // cmd UNSUBSCRIBE
}
type TypePacket = TypePacket3 & {
  properties?: {
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
}
```

## 示例
connect
```js
{
  cmd: 'connect',
  protocolId: 'MQTT',
  protocolVersion: 5,
  clean: true, // Can also be false
  clientId: 'my-device',
  keepalive: 0, // Seconds which can be any positive number, with 0 as the default setting
  username: 'matteo',
  password: Buffer.from('collina'), // Passwords are buffers
  will: {
    topic: 'mydevice/status',
    payload: Buffer.from('dead'), // Payloads are buffers
    properties: { // MQTT 5.0
      willDelayInterval: 1234,
      payloadFormatIndicator: false,
      messageExpiryInterval: 4321,
      contentType: 'test',
      responseTopic: 'topic',
      correlationData: Buffer.from([1, 2, 3, 4]),
      userProperties: {
        'test': 'test',
        'test2': 'testddd',
      }
    }
  },
  properties: { // MQTT 5.0 properties
    sessionExpiryInterval: 1234,
    receiveMaximum: 432,
    maximumPacketSize: 100,
    topicAliasMaximum: 456,
    requestResponseInformation: true,
    requestProblemInformation: true,
    userProperties: {
      'test': 'test'
    },
    authenticationMethod: 'test',
    authenticationData: Buffer.from([1, 2, 3, 4])
  }
}
```
connack
```js
{
  cmd: 'connack',
  sessionPresent: false, // Can also be true.
  reasonCode: 0, // reason code MQTT 5.0
  properties: { // MQTT 5.0 properties
    sessionExpiryInterval: 1234,
    receiveMaximum: 432,
    maximumQoS: 2,
    retainAvailable: true,
    maximumPacketSize: 100,
    assignedClientIdentifier: 'test',
    topicAliasMaximum: 456,
    reasonString: 'test',
    userProperties: {
      'test': 'test'
    },
    wildcardSubscriptionAvailable: true,
    subscriptionIdentifiersAvailable: true,
    sharedSubscriptionAvailable: false,
    serverKeepAlive: 1234,
    responseInformation: 'test',
    serverReference: 'test',
    authenticationMethod: 'test',
    authenticationData: Buffer.from([1, 2, 3, 4])
  }
}
```
publish
```js
{
  cmd: 'publish',
  retain: true,
  qos: 2,
  dup: true,
  length: 86,
  topic: 'test',
  payload: Buffer.from('test'),
  messageId: 10,
  properties: {
    payloadFormatIndicator: true,
    messageExpiryInterval: 4321,
    topicAlias: 100,
    responseTopic: 'topic',
    correlationData: Buffer.from([1, 2, 3, 4]),
    userProperties: {
      test: ['test', 'test', 'test']
    },
    subscriptionIdentifier: 120,
    contentType: 'test'
  }
}
```
puback
```js
{
  cmd: 'puback',
  retain: false,
  qos: 0,
  dup: false,
  length: 24,
  messageId: 2,
  reasonCode: 16,
  properties: {
    reasonString: 'test',
    userProperties: {
      test: 'test'
    }
  }
}
```
pubrec
```js
{
  cmd: 'pubrec',
  retain: false,
  qos: 0,
  dup: false,
  length: 24,
  messageId: 2,
  reasonCode: 16,
  properties: {
    reasonString: 'test',
    userProperties: {
      test: 'test'
    }
  }
}
```
pubrel
```js
{
  cmd: 'pubrel',
  retain: false,
  qos: 1,
  dup: false,
  length: 24,
  messageId: 2,
  reasonCode: 16,
  properties: {
    reasonString: 'test',
    userProperties: {
      test: 'test'
    }
  }
}
```
pubcomp
```js
{
  cmd: 'pubcomp',
  retain: false,
  qos: 0,
  dup: false,
  length: 24,
  messageId: 2,
  reasonCode: 16,
  properties: {
    reasonString: 'test',
    userProperties: {
      test: 'test'
    }
  }
}
```
subscribe
```js
{
  cmd: 'subscribe',
  subscriptions: [
    {
      topic: 'test',
      qos: 0,
      nl: false,
      rap: true,
      rh: 1
    }
  ],
  messageId: 6,
  properties: {
    subscriptionIdentifier: 145,
    userProperties: {
      test: 'test'
    }
  }
}
```
suback
```js
{
  cmd: 'suback',
  retain: false,
  qos: 0,
  dup: false,
  length: 27,
  granted: [0, 1, 2, 128],
  messageId: 6,
  properties: {
    reasonString: 'test',
    userProperties: {
      test: 'test'
    }
  }
}
```
unsubscribe
```js
{
  cmd: 'unsubscribe',
  retain: false,
  qos: 1,
  dup: false,
  length: 28,
  unsubscriptions: [
    'tfst',
    'test'
  ],
  messageId: 7,
  properties: {
    userProperties: {
      test: 'test'
    }
  }
}
```
unsuback
```js
{
  cmd: 'unsuback',
  retain: false,
  qos: 0,
  dup: false,
  length: 25,
  messageId: 8,
  properties: {
    reasonString: 'test',
    userProperties: {
      test: 'test'
    }
  },
  granted: [0, 128]
}
```
pingreq
```js
{
  cmd: 'pingreq',
  retain: false,
  qos: 0,
  dup: false,
  length: 0
}
```
pingresp
```js
{
  cmd: 'pingresp',
  retain: false,
  qos: 0,
  dup: false,
  length: 0
}
```
disconnect
```js
{
  cmd: 'disconnect',
  retain: false,
  qos: 0,
  dup: false,
  length: 34,
  reasonCode: 0,
  properties: {
    sessionExpiryInterval: 145,
    reasonString: 'test',
    userProperties: {
      test: 'test'
    },
    serverReference: 'test'
  }
}
```
auth
```js
{
  cmd: 'auth',
  retain: false,
  qos: 0,
  dup: false,
  length: 36,
  reasonCode: 0,
  properties: {
    authenticationMethod: 'test',
    authenticationData: Buffer.from([0, 1, 2, 3]),
    reasonString: 'test',
    userProperties: {
      test: 'test'
    }
  }
}
```
## 方法
```typescript
// MQTT5 封包 packet object 转为 buffer
declare function Encode (packet: MqttPacket.TypePacket): Buffer
// MQTT3.11 封包 packet object 转为 buffer
declare function Encode3 (packet: MqttPacket.TypePacket3): Buffer
// MQTT3.11 解包 buffer 转为 packet object
declare function Decode3 (buf: Buffer): MqttPacket.TypePacket3
// MQTT5 解包 buffer 转为 packet object
declare function Decode (buf: Buffer): MqttPacket.TypePacket
// 通过错误code转为文字, 支持MQTT5 协议规定
declare function FindReasonCodeName (cmd: MqttPacket.TypeControlTypes, code: number): MqttPacket.TypeReasonCodeName
// 通过错误文字转为code, 支持MQTT5 协议规定
declare function FindReasonCode (cmd: MqttPacket.TypeControlTypes, name: string): MqttPacket.TypeReasonCodeCode
```

## 性能
- **2.6 GHz 六核Intel Core i7**
- **16 GB 2667 MHz DDR4**
```
encode: 
Total 1000000
Total time 0.675969074010849s
/s 1479357
==================


encode3: 
Total 1000000
Total time 0.5646545230150223s
/s 1770994
==================


net encode: 
Total 1000000
Total time 1.2898821370005609s
/s 775264
==================


net encode3: 
Total 1000000
Total time 1.274387022972107s
/s 784690
==================


decode3: 
Total 1000000
Total time 0.5865604019761086s
/s 1704854
==================


decode: 
Total 1000000
Total time 0.6323886669874191s
/s 1581306
==================


mqtt-packet encode: 
Total 1000000
Total time 1.4981984170079232s
/s 667468
==================


net mqtt-packet encode: 
Total 1000000
Total time 2.1634436089992524s
/s 462226
==================


net mqtt-packet stream encode: 
Total 1000000
Total time 4.568760956943035s
/s 218877
==================


mqtt-packet encode3: 
Total 1000000
Total time 1.3746090469956398s
/s 727479
==================


net mqtt-packet encode3: 
Total 1000000
Total time 2.3290547789931297s
/s 429358
==================


net mqtt-packet stream encode3: 
Total 1000000
Total time 3.7970275739431383s
/s 263363
==================


mqtt-packet decode3: 
Total 1000000
Total time 2.4935472869873045s
/s 401035
==================


mqtt-packet decode: 
Total 1000000
Total time 2.4853677310347555s
/s 402354
==================
```



