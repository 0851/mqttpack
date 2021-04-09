import net from 'net'
import { performance } from 'perf_hooks'

export function time (
  title: string,
  fn: (i: number) => void,
  max: number = 1000000
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const start = performance.now()
      for (let i = 0; i < max; i++) {
        fn(i)
      }
      const time = performance.now() - start
      let s = time / 1000
      console.log(`${title}: `)
      console.log(`Total`, max)
      console.log(`Total time`, `${s}s`)
      console.log(`/s`, Math.floor(max / s))
      console.log(`==================\n\n`)
      resolve(undefined)
    }, 5000)
  })
}

export function netTime (
  title: string,
  fn: (dest: any, i: number) => void,
  max: number = 1000000
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const server = net.createServer((sock: any) => {
        sock.resume()
      })
      let dest: any

      server.listen(0, () => {
        let addrs = server.address()
        if (addrs === null) {
          return
        }
        if (typeof addrs === 'string') {
          dest = net.connect(addrs)
        } else {
          dest = net.connect(addrs.port, addrs.address)
        }
        let start = performance.now()
        function wait () {
          for (let i = 0; i < max; i++) {
            fn(dest, i)
          }
          dest.end()
        }
        dest.on('connect', wait)
        dest.on('drain', wait)
        dest.on('finish', () => {
          let time = performance.now() - start
          let s = time / 1000
          console.log(`net ${title}: `)
          console.log(`Total`, max)
          console.log(`Total time`, `${s}s`)
          console.log(`/s`, Math.floor(max / s))
          server.close()
          console.log(`==================\n\n`)
          resolve(undefined)
        })
      })
    }, 5000)
  })

}
