import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import babel from "rollup-plugin-babel";
import pkg from './package.json'


export default [
  {
    input: 'src/index.js',
    output: [
		{ file: pkg.main, format: 'cjs', name: 'hx.storage' },
		{ file: pkg.module, format: 'es', name: 'hx.storage' },
		{ file: pkg.browser, format: 'umd', name: 'hx.storage' }
    ],
    plugins: [
		commonjs(),
		babel(),
		terser(),
		filesize()
    ]
  }
]
