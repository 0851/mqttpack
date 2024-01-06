import {
  contactLow,
  getHight,
  DecodeMethod,
  getLow, getOffset, validBit, EncodeMethod, validUtf8
} from '../src/util'
import { expect } from 'chai';


// 随机生成 8位字节
function gen () {
  let i1 = []
  let i2 = []
  let i3 = []
  for (let index = 0; index < 8; index++) {
    let r = Math.floor(Math.random() * 10) > 5 ? '1' : '0'
    if (index <= 3) {
      i2.push(r)
      i1.push(r)
    } else {
      i3.push(r)
      i1.push(r)
    }
  }
  // console.log(i1, i2, i3)
  return {
    i1arr: i1,
    i2arr: i2,
    i3arr: i3,
    i1: parseInt(i1.join(''), 2),
    i2: parseInt(i2.join(''), 2),
    i3: parseInt(i3.join(''), 2)
  }
}
let count = 50
describe('测试二进制高位,低位', () => {
  // 验证获取高4位方法
  it('高位', () => {
    for (let index = 0; index < count; index++) {
      const element = gen();
      expect(getHight(element.i1)).to.equal(element.i2)
      expect(getHight(element.i1, 6)).to.equal(getHight(element.i2, 2))
    }
  })
  // 验证获取低4位方法
  it('低位', () => {
    for (let index = 0; index < count; index++) {
      const element = gen();
      expect(getLow(element.i1)).to.equal(element.i3)
      expect(getLow(element.i1, 2)).to.equal(getLow(element.i3, 2))
    }
  })
  // 验证合并高低
  it('还原', () => {
    for (let index = 0; index < count; index++) {
      const element = gen();
      expect(contactLow(element.i2, element.i3))
        .to
        .equal(element.i1)
      try {
        contactLow(contactLow(element.i1, element.i1, 8), contactLow(element.i1, element.i1, 8), 16)
      } catch (error) {
        expect(error.message)
          .to
          .equal('Does not support high 8 bits')
      }
    }
  })
  it('获取指定位置的结果', () => {
    for (let index = 0; index < count; index++) {
      const element = gen();
      expect(getOffset(element.i1, 1)).to.equal(parseInt(element.i1arr[6]))
    }
  })
  it('validBit', () => {
    expect(validBit('name', { name: 1, v: 0 })).to.eq(true)
    try {
      validBit('name', { name: 4, v: 0 }, 2)
    } catch (error) {
      expect(error.message).to.eq('name must be greater than zero and less than 3')
    }
  })
  it('validUtf8', () => {
    expect(validUtf8('\xBF', true)).to.eq('\uFEFF')
    expect(validUtf8('\xBF', false)).to.eq('\xBF')
    try {
      validUtf8('\u007F', false)
    } catch (error) {
      expect(error.message).to.equal("Invalid TypePacket Can't contain u0000 u0001-u001F u007F-u009F, \u007F")
    }
  })
  it('DecodeMethod', () => {
    let arr = [
      2, 3, 45,
      233, 21,
      255, 2,
      3, 5, 8, 6,
      0, 4, 116, 101, 115, 116, //test - utf8
      0, 0,
      192, 196, 7,
      192, 196, 7,
      0, 1,
      0, 2, 22, 21,
      127,
    ]
    let buf = Buffer.from(arr)
    let a = new DecodeMethod(buf)
    expect(a.peek()).to.equal(2);
    expect(a.read()).to.equal(2);
    expect(a.peek()).to.equal(3);
    expect(a.index()).to.equal(1);
    expect(Buffer.from([3, 45]).equals(a.peekMultiple(2))).to.equal(true);
    expect(Buffer.from([3, 45]).equals(a.multiple(2))).to.equal(true);
    expect(Buffer.from([233]).equals(a.multipleForce(1))).to.equal(true);
    expect(a.readForce()).to.equal(21);
    expect(a.readUInt16BE()).to.equal(65282)
    expect(a.readUInt32BE()).to.equal(50661382)
    expect(a.readUTF8()).to.equal('test')
    expect(a.readUTF8()).to.equal('')
    expect(a.readVarInt()).to.equal(123456)
    try {
      a.readVarInt(2)
    } catch (error) {
      expect(error.message).to.equal(`Malformed Remaining Length max 2`)
    }
    try {
      a.multipleForce(100)
    } catch (error) {
      expect(error.message).to.equal(`packet length error`)
    }
    expect(Buffer.from([192, 196, 7]).equals(a.multiple(3))).to.equal(true);

    expect(a.readForce()).to.equal(0);
    expect(Buffer.from([1, 0, 2, 22, 21, 127]).equals(a.peekMultiple())).to.equal(true);
    expect(a.readForce()).to.equal(1);
    expect(Buffer.from([22, 21]).equals(a.readBinaryBuf())).to.eq(true)
    expect(a.readForce()).to.equal(127);
    expect(a.read()).to.equal(undefined);
    try {
      a.readForce()
    } catch (error) {
      expect(error.message).to.eq('packet error can not read')
      expect(a.index()).to.eq(arr.length)
    }
    try {
      a.multipleForce(2)
    } catch (error) {
      expect(error.message).to.eq('packet length error')
      expect(a.index()).to.eq(arr.length)
    }
  });
  it('EncodeMethod', () => {
    let e = new EncodeMethod()
    e.writeVarInt(123456)
    try {
      e.writeVarInt(123456, 2)
    } catch (error) {
      expect(error.message).to.eq('Malformed Remaining Length max size 2')
    }
    e.writeUInt16BE(65282)
    try {
      e.writeUInt16BE(65536)
    } catch (error) {
      expect(error.message).to.eq('too large must be less 65535')
    }
    e.writeUInt32BE(50661382)
    try {
      e.writeUInt32BE(4294967298)
    } catch (error) {
      expect(error.message).to.eq('too large must be less 4294967295')
    }
    e.writeUTF8('test')
    e.writeUTF8NoLength('test')
    e.writeByte(2)
    try {
      e.writeUTF8("test".repeat(65525))
    } catch (error) {
      expect(error.message).to.eq('too large must be less 65535')
    }
    try {
      e.writeByte(266)
    } catch (error) {
      expect(error.message).to.eq('too large must be less 255')
    }
    e.writeBinaryData(Buffer.from([13, 25]))
    e.writeBinaryData()
    e.writeBinaryDataNoLength(Buffer.from([13, 25]))
    try {
      e.writeBinaryData(Buffer.from("test".repeat(65525), 'utf8'))
    } catch (error) {
      expect(error.message).to.eq('too large must be less 65535')
    }
    let e1 = new EncodeMethod()
    e1.writeByte(2)
    e.concat(e1.body())
    let r = e.result(6)
    let arr = [
      192, 196, 7,
      255, 2,
      3, 5, 8, 6,
      0, 4, 116, 101, 115, 116,
      116, 101, 115, 116,
      2,
      0, 2,
      13, 25,
      0, 0,
      13, 25,
      2
    ]
    let a = Buffer.from([
      6,
      ...e.writeVarIntAsArray(arr.length),
      ...arr
    ])
    console.log(r.toString('hex'))
    console.log(a.toString('hex'))
    expect(a.equals(r)).to.eq(true)
    console.log(r)
  })
})