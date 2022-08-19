import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import babel from "rollup-plugin-babel";
import ts from "rollup-plugin-typescript2";

import pkg from './package.json'


const isPro = process.env.NODE_ENV === "production";

const extensions = [
    '.js',
    '.ts',
]

const plugins = [
    ts({
        extensions
    }),
    commonjs(),
    babel(),
    filesize()
]

// if (isPro) {
//     plugins.push(terser());
// }

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
    input: 'src/index.ts',
    output: [
        // "browser": "dist/hx-storage.js",
        // { file: pkg.browser, format: 'cjs', name: 'hxStorage', banner, footer },
        { file: pkg.module, format: 'es', name: 'hxStorage', banner, footer },
		{ file: pkg.main, format: 'umd', name: 'hxStorage', banner, footer }
    ],
    plugins
  }
]

