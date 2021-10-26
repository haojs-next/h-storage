import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import babel from "rollup-plugin-babel";
import pkg from './package.json'


const isPro = process.env.NODE_ENV === "production";
console.log(isPro);

const plugins = [
    commonjs(),
    babel(),
    filesize()
]


// browser
if (isPro) {
    plugins.push(terser());
}

// 设置头部注释信息
const banner =
    '/*!\n' +
    ` * hx-storage v${pkg.version}\n` +
    ` * (c) 2018-${new Date().getFullYear()} ljh\n` +
    ' * Released under the MIT License.\n' +
    ' */'

// 设置尾部注释信息
const footer = `\n/** ${new Date()} **/`


export default [
  {
    input: 'src/index.js',
    output: [
        { file: pkg.main, format: 'cjs', name: 'hxStorage', banner, footer },
        { file: pkg.module, format: 'es', name: 'hxStorage', banner, footer },
		{ file: pkg.browser, format: 'umd', name: 'hxStorage', banner, footer }
    ],
    plugins
  }
]

