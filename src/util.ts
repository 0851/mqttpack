// 获取高位
export function getHight (b: number, n: number = 4): number {
  return b >> n
}
// 获取低位
export function getLow (b: number, n: number = 4): number {
  return b & (Math.pow(2, n) - 1)
}
// 连接高低位
export function contactLow (b1: number, b2: number, range: number = 4): number {
  if (range >= 8) {
    throw new Error(`Does not support high 8 bits`)
  }
  return (b1 * Math.pow(2, range)) | b2
}
// 从右往左判断, 超出范围为0, 单字节 8位, 位移安全
export function getOffset (b: number, n: number): 0 | 1 {
  return (b & Math.pow(2, n)) > 0 ? 1 : 0
}

export function validBit<T extends { [key: string]: string | number }> (k: keyof T, obj: T, n: number = 1): boolean {
  let max = Math.pow(2, n) - 1
  if (obj[k] > max || obj[k] < 0) {
    throw new Error(`${k} must be greater than zero and less than ${max}`)
  }
  return true
}

let ueffreg = new RegExp('[\\xEF\\xBB\\xBF]', 'g')
export function validUtf8 (content: string, replace: boolean): string {
  //UTF-8 编码的字符串不能包含空字符 U+0000 [MQTT-1.5.4-2]。如果客户端或服务端收到了一个包含
  // U+0000 的控制报文，它必须关闭网络连接。
  // 数据中不应该包含下面这些 Unicode 代码点的编码。如果一个接收者(服务端或客户端)收到了包含下列
  // 任意字符的 MQTT 控制报文，它可以把此报文当做无效报文。
  //  U+0001 和 U+001F 之间的控制字符
  //  U+007F 和 U+009F 之间的控制字符
  //  [Unicode] 规范定义的非字符代码点(例如 U+0FFFF)
  if (replace) {
    content = content.replace(ueffreg, '\uFEFF')
    ueffreg.lastIndex = 0
  }
  // ueffreg.lastIndex = 0 // 重设 reg 正则对象位移
  if (/[\u0000\u0001-\u001F\u007F-\u009F]/.test(content)) {
    throw new Error(`Invalid TypePacket Can't contain u0000 u0001-u001F u007F-u009F, ${content}`)
  }
  return content
}
export class DecodeMethod implements MqttPacket.InterfaceDecodeMethod {
  private pos: number
  constructor (public buf: Buffer) {
    this.pos = 0
  }
  peek (): number | undefined {
    return this.buf[this.pos]
  }
  peekMultiple (len?: number): Buffer {
    return len ? this.buf.slice(this.pos, this.pos + len) : this.buf.slice(this.pos)
  }
  index (): number {
    return this.pos
  }
  multiple (len?: number): Buffer {
    let r = this.peekMultiple(len)
    this.pos = this.pos + r.length
    return r
  }
  multipleForce (len: number): Buffer {
    let r = this.peekMultiple(len)
    if (r.length !== len) {
      throw new Error(`packet length error`)
    }
    this.pos = this.pos + r.length
    return r
  }
  readForce (): number {
    let r = this.peek()
    if (r === undefined) {
      throw new Error(`packet error can not read`)
    }
    this.pos++
    return r
  }
  read (): number | undefined {
    let r = this.peek()
    if (r !== undefined) {
      this.pos++
    }
    return r
  }
  readUInt16BE (): number {
    let r = this.buf.readUInt16BE(this.pos)
    this.pos = this.pos + 2
    return r
  }
  readUInt32BE (): number {
    let r = this.buf.readUInt32BE(this.pos)
    this.pos = this.pos + 4
    return r
  }
  readBinaryBuf (): Buffer {
    let len = this.buf.readUInt16BE(this.pos)
    let end = this.pos + 2 + len
    let content = this.buf.slice(this.pos + 2, end)
    this.pos = end
    return content
  }
  readVarInt (max?: number): number {
    let length = 0
    let len = this.pos
    while (true) {
      let bit = this.buf[len]
      let isr = getOffset(bit, 7)
      length = length | ((bit & 127) * Math.pow(2, (len - this.pos) * 7))
      // 位移>>超过32位不安全, 使用其他方法 Math.pow
      len++
      if (!isr) {
        break
      }
    }
    if (max !== undefined && (len - this.pos) > max) {
      throw new Error(`Malformed Remaining Length max ${max}`)
    }
    this.pos = len
    return length
  }
  readUTF8 (): string {
    let len = this.buf.readUInt16BE(this.pos)
    let end = this.pos + 2 + len
    let content = this.buf.slice(this.pos + 2, end).toString('utf8')
    content = validUtf8(content, true)
    this.pos = end
    return content
  }
}


export class EncodeMethod implements MqttPacket.InterfaceEncodeMethod {
  bodies: MqttPacket.TypeEncodeData[]
  constructor () {
    this.bodies = []
  }
  result (header: number) {
    let len = this.byteLength()
    let lbuf = this.writeVarIntAsArray(len)
    let buf = Buffer.allocUnsafe(1 + lbuf.length + len)
    buf.writeUInt8(header)
    this._copyVarInt(buf, lbuf, 1)
    let offset = 1 + lbuf.length
    let bodies = this.bodies
    let length = bodies.length
    for (let index = 0; index < length; index++) {
      const element = bodies[index];
      let type = element.type
      let value = element.value
      let len = element.len
      if (type === 'varint' && value instanceof Array) {
        this._copyVarInt(buf, value, offset)
      }
      if (type === 'uint16' && typeof value === 'number') {
        buf.writeUInt16BE(value, offset)
      }
      if (type === 'uint32' && typeof value === 'number') {
        buf.writeUInt32BE(value, offset)
      }
      if (type === 'utf8' && typeof value === 'string') {
        buf.write(value, offset, 'utf8')
      }
      if (type === 'byte' && typeof value === 'number') {
        buf.writeUInt8(value, offset)
      }
      if (type === 'binaryData' && value instanceof Buffer) {
        value.copy(buf, offset)
      }
      offset = offset + len
    }
    return buf
  }
  byteLength () {
    let byteLength = 0
    let bodies = this.bodies
    for (let index = 0, len = bodies.length; index < len; index++) {
      const element = bodies[index];
      let len = element.len
      byteLength = byteLength + len
    }
    return byteLength
  }
  body (): MqttPacket.TypeEncodeData[] {
    return this.bodies
  }
  private _copyVarInt (buf: Buffer, list: number[], offset: number,) {
    for (let index = 0, len = list.length; index < len; index++) {
      const n = list[index];
      buf.writeUInt8(n, offset + index)
    }
  }
  writeVarIntAsArray (n: number, max?: number): number[] {
    let list = []
    let index = 0
    for (index; n > 127; index++) {
      let i = 128 | (n & 127) // 取后7位,在前置追加标记
      list.push(i)
      n >>= 7 //后移7位
    }
    //最后一个字节数
    list.push(n)
    if (max !== undefined && list.length > max) {
      throw new Error(`Malformed Remaining Length max size ${max}`)
    }
    return list
  }
  writeVarInt (n: number, max?: number) {
    let list = this.writeVarIntAsArray(n, max)
    this.push({
      type: 'varint',
      value: list,
      len: list.length
    })
  }
  writeUInt16BE (n: number) {
    if (n > 65535) {
      throw new Error(`too large must be less 65535`)
    }
    this.push({
      type: 'uint16',
      value: n,
      len: 2
    })
  }
  writeUInt32BE (n: number) {
    if (n > 4294967295) {
      throw new Error(`too large must be less 4294967295`)
    }
    this.push({
      type: 'uint32',
      value: n,
      len: 4
    })
  }
  writeUTF8 (str: string) {
    str = validUtf8(str, false)
    let l = Buffer.byteLength(str, 'utf8')
    this.writeUInt16BE(l)
    this.push({
      type: 'utf8',
      value: str,
      len: l
    })
  }
  writeUTF8NoLength (str: string) {
    str = validUtf8(str, false)
    this.push({
      type: 'utf8',
      value: str,
      len: Buffer.byteLength(str, 'utf8')
    })
  }
  writeBinaryDataNoLength (buf: Buffer) {
    this.push({
      type: 'binaryData',
      value: buf,
      len: buf.length
    })
  }
  writeByte (n: number) {
    if (n > 255) {
      throw new Error(`too large must be less 255`)
    }
    this.push({
      type: 'byte',
      value: n,
      len: 1
    })
  }
  writeBinaryData (buf?: Buffer) {
    let l = buf?.length || 0
    this.writeUInt16BE(l)
    if (buf) {
      this.push({
        type: 'binaryData',
        value: buf,
        len: l
      })
    }
  }
  push (value: MqttPacket.TypeEncodeData) {
    this.bodies.push(value)
  }
  concat (values: MqttPacket.TypeEncodeData[]) {
    Array.prototype.push.apply(this.bodies, values)
  }
}