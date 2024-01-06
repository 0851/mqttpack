import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import path from 'path'
export default [
  {
    input: 'index.ts',
    output: {
      file: './dist/browser.min.js',
      format: 'umd',
      name: 'mqttpack',
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
    input: 'index.ts',
    output: {
      file: './dist/node.v4.min.js',
      format: 'cjs',
      name: 'mqttpack',
      sourcemap: true,
    },
    plugins: [
      typescript({ module: 'esnext' }),
      nodePolyfills({
        include: "./src/*",
        exclude: /global\.js/
      }),
      getBabelOutputPlugin({
        configFile: path.resolve(__dirname, '.babelrc')
      }),
      terser()
    ]
  },
  {
    input: 'index.ts',
    output: {
      file: './dist/node.v6.min.js',
      format: 'cjs',
      name: 'mqttpack',
      sourcemap: true,
    },
    plugins: [
      typescript({ module: 'esnext' }),
      getBabelOutputPlugin({
        configFile: path.resolve(__dirname, '.babelrc')
      }),
      terser()
    ]
  },
  {
    input: './src/reasonCode.ts',
    output: {
      file: './dist/reasoncode.min.js',
      format: 'umd',
      name: 'reasoncode',
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