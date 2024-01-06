import { expect } from 'chai';
import mqtt from 'mqtt-packet'
import { Encode, Encode3 } from '../src/encode';
import { Decode, Decode3 } from '../src/decode';
const parser = mqtt.parser()

export const testPacket = {
  connect: {
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
  },
  connack: {
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
  },
  publish: {
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
  },
  puback: {
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
  },
  pubrec: {
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
  },
  pubrel: {
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
  },
  pubcomp: {
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
  },
  subscribe: {
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
  },
  suback: {
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
  },
  unsubscribe: {
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
  },
  unsuback: {
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
  },
  pingreq: {
    cmd: 'pingreq',
    retain: false,
    qos: 0,
    dup: false,
    length: 0
  },
  pingresp: {
    cmd: 'pingresp',
    retain: false,
    qos: 0,
    dup: false,
    length: 0
  },
  disconnect: {
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
  },
  auth: {
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
}


export const testPacket3 = {
  connect: {
    cmd: 'connect',
    clean: true, // Can also be false
    clientId: 'my-device',
    keepalive: 0, // Seconds which can be any positive number, with 0 as the default setting
    username: 'matteo',
    password: Buffer.from('collina'), // Passwords are buffers
    will: {
      topic: 'mydevice/status',
      payload: Buffer.from('dead'), // Payloads are buffers
    },
  },
  connack: {
    cmd: 'connack',
    retain: false,
    qos: 0,
    dup: false,
    length: 2,
    topic: null,
    payload: null,
    sessionPresent: false,
    reasonCode: 1,
    returnCode: 1
  },
  publish: {
    cmd: 'publish',
    retain: false,
    qos: 0,
    dup: false,
    length: 10,
    topic: 'test',
    payload: Buffer.from('test')
  },
  subscribe: {
    cmd: 'subscribe',
    subscriptions: [
      {
        topic: 'test',
        qos: 0
      }
    ],
    messageId: 6
  },
  puback: {
    cmd: 'puback',
    messageId: 42,
    retain: false,
    qos: 0,
    dup: false,
    length: 2,
    topic: null,
    payload: null,
    reasonCode: 0
  },
  pubrec: {
    cmd: 'pubrec',
    retain: false,
    qos: 0,
    dup: false,
    length: 2,
    messageId: 2
  },
  pubrel: {
    cmd: 'pubrel',
    retain: false,
    qos: 1,
    dup: false,
    length: 2,
    messageId: 2
  },
  pubcomp: {
    cmd: 'pubcomp',
    retain: false,
    qos: 0,
    dup: false,
    length: 2,
    messageId: 2
  },
  suback: {
    cmd: 'suback',
    retain: false,
    qos: 0,
    dup: false,
    length: 6,
    granted: [0, 1, 2, 128],
    messageId: 6
  },
  unsubscribe: {
    cmd: 'unsubscribe',
    retain: false,
    qos: 1,
    dup: false,
    length: 14,
    unsubscriptions: [
      'tfst',
      'test'
    ],
    messageId: 7
  },
  unsuback: {
    cmd: 'unsuback',
    retain: false,
    qos: 0,
    dup: false,
    length: 2,
    messageId: 8
  },
  pingreq: {
    cmd: 'pingreq',
    retain: false,
    qos: 0,
    dup: false,
    length: 0
  },
  pingresp: {
    cmd: 'pingresp',
    retain: false,
    qos: 0,
    dup: false,
    length: 0
  },
  disconnect: {
    cmd: 'disconnect',
    retain: false,
    qos: 0,
    dup: false,
    length: 0
  }
}
// function logFormat (l: any) {
//   console.log(JSON.stringify(l, undefined, 4))
//   console.log('===logFormat===')
// }


const specialTestPacket = {

  connect: {
    cmd: 'connect',
    protocolId: 'MQTT',
    clean: false, // Can also be false
    clientId: 'my-device',
    willQos: 1,
    willFlag: false,
    usernameFlag: true,
    passwordFlag: true,
    willRetainFlag: true,
    keepalive: 0, // Seconds which can be any positive number, with 0 as the default setting
    // will: {
    //   qos: 1,
    //   payload: Buffer.from('dead'), // Payloads are buffers
    //   properties: { // MQTT 5.0
    //     willDelayInterval: 1234,
    //     payloadFormatIndicator: false,
    //     messageExpiryInterval: 4321,
    //     contentType: 'test',
    //     responseTopic: 'topic',
    //     correlationData: Buffer.from([1, 2, 3, 4]),
    //     userProperties: {
    //       'test': 'test',
    //       'test2': 'testddd',
    //     }
    //   }
    // },
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
  },
  connect2: {
    cmd: 'connect',
    protocolId: 'MQTT',
    clean: false, // Can also be false
    clientId: 'my-device',
    willQos: 1,
    willFlag: false,
    usernameFlag: true,
    passwordFlag: true,
    willRetainFlag: true,
    keepalive: 0, // Seconds which can be any positive number, with 0 as the default setting
    will: {
      qos: 1,
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
  },
  connack: {
    cmd: 'connack',
    sessionPresent: true, // Can also be true.
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
  },
  publish: {
    cmd: 'publish',
    retain: true,
    qos: 2,
    dup: true,
    length: 86,
    topic: 'test',
    payload: "test",
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
  },
  pubcomp: {
    cmd: 'pubcomp',
    retain: false,
    qos: 0,
    dup: false,
    length: 24,
    messageId: 2,
    properties: {
      reasonString: 'test',
      userProperties: {
        test: 'test'
      }
    }
  },
  unsubscribe: {
    cmd: 'unsubscribe',
    retain: false,
    qos: 1,
    dup: false,
    length: 28,
    messageId: 7,
    properties: {
      userProperties: {
        test: 'test'
      }
    }
  },
  subscribe: {
    cmd: 'subscribe',
    subscriptions: [
      {
        topic: 'test',
        qos: 0,
        nl: false,
        rap: false,
        rh: 1
      },
      {
        topic: 'test222',
        qos: 0,
        nl: true,
        rap: false,
        rh: false
      },
      {
        topic: 'test222',
        qos: 1,
        nl: false,
        rap: false,
        rh: false
      }
    ],
    messageId: 6,
    // properties: {
    //   subscriptionIdentifier: 145,
    //   userProperties: {
    //     test: 'test'
    //   }
    // }
  },
  subscribe2: {
    cmd: 'subscribe',
    messageId: 6,

  },
  suback: {
    cmd: 'suback',
    retain: false,
    qos: 0,
    dup: false,
    length: 6,
    messageId: 6
  },
}
describe('encode', () => {

  it('encode decode', () => {
    Decode(Buffer.from(Encode({
      cmd: 'publish',
      qos: 1,
      messageId: 1020,
      dup: false,
      retain: false,
      topic: 'testtesttest',
      payload: 'testtesttesttesttest'
    })))
  });
  [
    'connect',
    'connect2',
    'connack',
    'publish',
    'pubcomp',
    'subscribe',
    'subscribe2',
    'unsubscribe',
    'suback'
  ].forEach((key) => {
    let item = (specialTestPacket as any)[key]
    it(`test encode special ${key} 5`, () => {
      let encode = Encode(item)
      expect(encode.toString('hex')).to.equal(Encode(Decode(encode)).toString('hex'));
    });
  });
  [
    'connect',
    'connack',
    'publish',
    'puback',
    'pubrec',
    'pubrel',
    'pubcomp',
    'subscribe',
    'suback',
    'unsubscribe',
    'unsuback',
    'pingreq',
    'pingresp',
    'disconnect',
    'auth'
  ].forEach((key: string) => {
    let item = (testPacket as any)[key]
    let item3 = (testPacket3 as any)[key]
    if (!item) {
      console.log(`缺少 ${key} 测试包`)
    } else {
      it(`test encode ${key} 5`, () => {
        let encode = Encode(item)
        let m = mqtt.generate(item, {
          protocolVersion: 5
        })
        let v = mqtt.generate(Decode(m) as any, {
          protocolVersion: 5
        })
        // logFormat(Decode(m))
        // logFormat(Decode(encode))
        // logFormat(parser.parse(m, { protocolVersion: 5 }))
        expect(v.toString('hex')).to.equal(encode.toString('hex'));
      });
    }
    if (!item3) {
      console.log(`缺少 ${key} 3 测试包`)
    } else {
      it(`test encode ${key} 3`, () => {
        let encode = Encode3(item3)
        let m = mqtt.generate(item3, {
          protocolVersion: 4
        })

        let v = mqtt.generate(Decode3(m) as any, {
          protocolVersion: 4
        })
        // logFormat(Decode3(m))
        // logFormat(Decode3(encode))
        // logFormat(parser.parse(m, { protocolVersion: 4 }))
        expect(v.toString('hex')).to.equal(encode.toString('hex'));
      });
      it(`test encode ${key} MQIsdp 3`, () => {
        let encode = Encode3({
          ...item3,
          protocolId: 'MQIsdp',
          protocolVersion: 3
        })
        let m = mqtt.generate({
          ...item3,
          protocolId: 'MQIsdp',
          protocolVersion: 3
        }, {
          protocolVersion: 3
        })

        let v = mqtt.generate(Decode3(m) as any, {
          protocolVersion: 3
        })
        // logFormat(Decode3(m))
        // logFormat(Decode3(encode))
        // logFormat(parser.parse(m, { protocolVersion: 4 }))
        expect(v.toString('hex')).to.equal(encode.toString('hex'));
      });
    }
  })
})