import { expect } from 'chai';
import { FindReasonCodeName, FindReasonCode } from './reasonCode';
describe('reasonCode', () => {
  it('FindReasonCodeName', () => {
    expect(FindReasonCodeName('suback', 0x8F)).to.eq('topicFilterInvalid')
    try {
      FindReasonCodeName('suback', 123)
    } catch (error) {
      expect(error.message).to.eq('suback reasonCode 123 not support')
    }
    try {
      FindReasonCodeName('pingreq', 123)
    } catch (error) {
      expect(error.message).to.eq('pingreq reasonCode not support')
    }
  })
  it('FindReasonCode', () => {
    expect(FindReasonCode('disconnect', 'topicFilterInvalid')).to.eq(0x8F)
    try {
      FindReasonCode('suback', 'normalDisconnection')
    } catch (error) {
      expect(error.message).to.eq('suback reasonName normalDisconnection not support')
    }
    try {
      FindReasonCode('pingreq', 'NormalDisconnection')
    } catch (error) {
      expect(error.message).to.eq('pingreq reasonName not support')
    }
  })
})