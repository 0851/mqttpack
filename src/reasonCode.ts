
export const ReasonCodes: Partial<Record<MqttPacket.TypeControlTypes, MqttPacket.TypeReasonCode[]>> = {
  'connack': [
    { code: 0x00, name: 'success' },
    { code: 0x80, name: 'unspecifiedError' },
    { code: 0x81, name: 'malformedPacket' },
    { code: 0x82, name: 'protocolError' },
    { code: 0x83, name: 'implementationSpecificError' },
    { code: 0x84, name: 'unsupportedProtocolVersion' },
    { code: 0x85, name: 'clientIdentifierNotValid' },
    { code: 0x86, name: 'badUserNameOrPassword' },
    { code: 0x87, name: 'notAuthorized' },
    { code: 0x88, name: 'serverUnavailable' },
    { code: 0x89, name: 'serverBusy' },
    { code: 0x8A, name: 'banned' },
    { code: 0x8C, name: 'badAuthenticationMethod' },
    { code: 0x90, name: 'topicNameInvalid' },
    { code: 0x95, name: 'packetTooLarge' },
    { code: 0x97, name: 'quotaExceeded' },
    { code: 0x99, name: 'payloadFormatInvalid' },
    { code: 0x9A, name: 'retainNotSupported' },
    { code: 0x9B, name: 'qoSNotSupported' },
    { code: 0x9C, name: 'useAnotherServer' },
    { code: 0x9D, name: 'serverMoved' },
    { code: 0x9F, name: 'connectionRateExceeded' },
  ],
  'puback': [
    { code: 0x00, name: 'success' },
    { code: 0x10, name: 'noMatchingSubscribers' },
    { code: 0x80, name: 'unspecifiedError' },
    { code: 0x83, name: 'implementationSpecificError' },
    { code: 0x87, name: 'notAuthorized' },
    { code: 0x90, name: 'topicNameInvalid' },
    { code: 0x91, name: 'packetIdentifierInUse' },
    { code: 0x97, name: 'quotaExceeded' },
    { code: 0x99, name: 'payloadFormatInvalid' },
  ],
  'pubrec': [
    { code: 0x00, name: 'success' },
    { code: 0x10, name: 'noMatchingSubscribers' },
    { code: 0x80, name: 'unspecifiedError' },
    { code: 0x83, name: 'implementationSpecificError' },
    { code: 0x87, name: 'notAuthorized' },
    { code: 0x90, name: 'topicNameInvalid' },
    { code: 0x91, name: 'packetIdentifierInUse' },
    { code: 0x97, name: 'quotaExceeded' },
    { code: 0x99, name: 'payloadFormatInvalid' },
  ],
  'pubrel': [
    { code: 0x00, name: 'success' },
    { code: 0x92, name: 'packetIdentifierNotFound' },
  ],
  'pubcomp': [
    { code: 0x00, name: 'success' },
    { code: 0x92, name: 'packetIdentifierNotFound' },
  ],
  'suback': [
    { code: 0x00, name: 'grantedQoS0' },
    { code: 0x01, name: 'grantedQoS1' },
    { code: 0x02, name: 'grantedQoS2' },
    { code: 0x80, name: 'unspecifiedError' },
    { code: 0x83, name: 'implementationSpecificError' },
    { code: 0x87, name: 'notAuthorized' },
    { code: 0x8F, name: 'topicFilterInvalid' },
    { code: 0x91, name: 'packetIdentifierInUse' },
    { code: 0x97, name: 'quotaExceeded' },
    { code: 0x9E, name: 'sharedSubscriptionsNotSupported' },
    { code: 0xA1, name: 'subscriptionIdentifiersNotSupported' },
    { code: 0xA2, name: 'wildcardSubscriptionsNotSupported' },
  ],
  'unsuback': [
    { code: 0x00, name: 'success' },
    { code: 0x11, name: 'noSubscriptionExisted' },
    { code: 0x80, name: 'unspecifiedError' },
    { code: 0x83, name: 'implementationSpecificError' },
    { code: 0x87, name: 'notAuthorized' },
    { code: 0x8F, name: 'topicFilterInvalid' },
    { code: 0x91, name: 'packetIdentifierInUse' },
  ],
  'disconnect': [
    { code: 0x00, name: 'normalDisconnection' },
    { code: 0x04, name: 'disconnectWithWillMessage' },
    { code: 0x80, name: 'unspecifiedError' },
    { code: 0x81, name: 'malformedPacket' },
    { code: 0x82, name: 'protocolError' },
    { code: 0x83, name: 'implementationSpecificError' },
    { code: 0x87, name: 'notAuthorized' },
    { code: 0x89, name: 'serverBusy' },
    { code: 0x8B, name: 'serverShuttingDown' },
    { code: 0x8D, name: 'keepAliveTimeout' },
    { code: 0x8E, name: 'sessionTakenOver' },
    { code: 0x8F, name: 'topicFilterInvalid' },
    { code: 0x90, name: 'topicNameInvalid' },
    { code: 0x93, name: 'receiveMaximumExceeded' },
    { code: 0x94, name: 'topicAliasInvalid' },
    { code: 0x95, name: 'packetTooLarge' },
    { code: 0x96, name: 'messageRateTooHigh' },
    { code: 0x97, name: 'quotaExceeded' },
    { code: 0x98, name: 'administrativeAction' },
    { code: 0x99, name: 'payloadFormatInvalid' },
    { code: 0x9A, name: 'retainNotSupported' },
    { code: 0x9B, name: 'qoSNotSupported' },
    { code: 0x9C, name: 'useAnotherServer' },
    { code: 0x9D, name: 'serverMoved' },
    { code: 0x9E, name: 'sharedSubscriptionsNotSupported' },
    { code: 0xA0, name: 'maximumConnectTime' },
    { code: 0xA1, name: 'subscriptionIdentifiersNotSupported' },
    { code: 0xA2, name: 'wildcardSubscriptionsNotSupported' },
  ],
  'auth': [
    { code: 0x00, name: 'success' },
    { code: 0x18, name: 'continueAuthentication' },
    { code: 0x19, name: 'reAuthenticate' },
  ]
}

export function FindReasonCodeName (cmd: MqttPacket.TypeControlTypes, code: number): MqttPacket.TypeReasonCodeName {
  let codes = ReasonCodes[cmd]
  if (!codes) {
    throw new Error(`${cmd} reasonCode not support`)
  }
  let find: MqttPacket.TypeReasonCode | undefined = undefined
  for (let index = 0; index < codes.length; index++) {
    const element = codes[index];
    if (element.code === code) {
      find = element
    }
  }
  if (find === undefined) {
    throw new Error(`${cmd} reasonCode ${code} not support`)
  }
  return find.name
}
export function FindReasonCode (cmd: MqttPacket.TypeControlTypes, name: string): MqttPacket.TypeReasonCodeCode {
  let codes = ReasonCodes[cmd]
  if (!codes) {
    throw new Error(`${cmd} reasonName not support`)
  }
  let find: MqttPacket.TypeReasonCode | undefined = undefined
  for (let index = 0; index < codes.length; index++) {
    const element = codes[index];
    if (element.name === name) {
      find = element
    }
  }
  if (find === undefined) {
    throw new Error(`${cmd} reasonName ${name} not support`)
  }
  return find.code
}