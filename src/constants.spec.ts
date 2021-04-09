import { expect } from 'chai';
import { ControlTypesList, encodeFlag, decodeFlag } from './constants';
describe('constants', () => {
  it('flag', () => {
    ControlTypesList.forEach((k) => {
      if (k === 'publish') {
        expect(encodeFlag(k, false, 0)).to.equal(parseInt('0000', 2))
        expect(encodeFlag(k, false, 1)).to.equal(parseInt('0010', 2))
        expect(encodeFlag(k, false, 2)).to.equal(parseInt('0100', 2))
        expect(encodeFlag(k, true, 0)).to.equal(parseInt('1000', 2))
        expect(encodeFlag(k, true, 1)).to.equal(parseInt('1010', 2))
        expect(encodeFlag(k, true, 2)).to.equal(parseInt('1100', 2))
        expect(encodeFlag(k, true, 2, true)).to.equal(parseInt('1101', 2))
        try {
          encodeFlag(k, true, 3)
        } catch (error) {
          expect(error.message).to.equal('qos must be 0 | 1 | 2')
        }
        let a1 = decodeFlag(parseInt('0000', 2))
        let a2 = decodeFlag(parseInt('0010', 2))
        let a3 = decodeFlag(parseInt('0100', 2))
        let a4 = decodeFlag(parseInt('1000', 2))
        let a5 = decodeFlag(parseInt('1010', 2))
        let a6 = decodeFlag(parseInt('1100', 2))
        expect(
          a1.dup === a2.dup
          && a2.dup === a3.dup
          && a1.retain === a2.retain
          && a2.retain === a3.retain
          && a3.retain === false
        ).to.equal(true)
        expect(
          a4.dup === a5.dup
          && a5.dup === a6.dup
          && a6.dup === true
        ).to.equal(true)
        expect(
          a1.qos === 0
          && a1.qos === a4.qos
        ).to.equal(true)
        expect(
          a2.qos === 1
          && a2.qos === a5.qos
        ).to.equal(true)
        expect(
          a3.qos === 2
          && a3.qos === a6.qos
        ).to.equal(true)
        // try {
        //   decodeFlag(parseInt('1101', 2))
        // } catch (error) {
        //   expect(error.message).to.equal('retain must be 0')
        // }
        try {
          decodeFlag(parseInt('1110', 2))
        } catch (error) {
          expect(error.message).to.equal('qos must be 0 | 1 | 2')
        }
        try {
          decodeFlag(parseInt('11100', 2))
        } catch (error) {
          expect(error.message).to.equal('dup must be 0 | 1')
        }
      } else if (k === 'pubrel' || k === 'subscribe' || k === 'unsubscribe') {
        expect(encodeFlag(k)).to.equal(2)
      } else {
        expect(encodeFlag(k)).to.equal(0)
      }
    })
  });
})