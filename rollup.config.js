import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import nodePolyfills from 'rollup-plugin-polyfill-node';
export default [
  {
    input: 'index.ts',
    output: {
      file: './dist/browser.min.js',
      format: 'umd',
      name: 'mqttpacket',
      sourcemap: true,
    },
    plugins: [
      typescript({ module: 'esnext' }),
      nodePolyfills({
        include: "./src/*",
        exclude: /global\.js/
      }),
      terser()
    ]
  },
  {
    input: './src/reasonCode.ts',
    output: {
      file: './dist/browser.reasoncode.min.js',
      format: 'umd',
      name: 'mqttpacketreasoncode',
      sourcemap: true,
    },
    plugins: [
      typescript({ module: 'esnext' }),
      nodePolyfills({
        include: "./src/*"
      }),
      terser()
    ]
  }
];