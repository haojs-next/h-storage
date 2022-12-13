// import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize';
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import ts from "rollup-plugin-typescript2";
import livereload from 'rollup-plugin-livereload'
import pkg from './package.json'
import serve from 'rollup-plugin-serve';
import { resolve } from "path"
import { nodeResolve } from '@rollup/plugin-node-resolve';

const isPro = process.env.NODE_ENV === "production";

const extensions = [
    '.js',
    '.ts',
]

let override = { compilerOptions: { declaration: false } };

const plugins = [
    ts({
        extensions,
        tsconfig: "./tsconfig.json",
        tsconfigOverride: override
    }),
    commonjs(),
    nodeResolve({
        browser: true,
    }),
    babel({ babelHelpers : 'bundled' }),
    filesize()
]

if (isPro) {
    // plugins.push(terser())
} else {
    plugins.push(livereload())
    plugins.push(serve({
        open: true,
        // openPage: "/public/index.html"
        openPage: "/examples/index.html"
    }))
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


const getEntry = (component) => {
    return resolve(`./packages/${component}.ts`)
}

function getPackageConfig (name) {
    return {
        input: getEntry(name),
        output: [
            { file: pkg.main, format: 'umd', name: 'hxUtils', banner, footer }
            // { file: `dist/${name}.js`, format: 'cjs', banner, footer },
        ],
        plugins
    }
}


function hxStorageConfig () {
    return {
        input: "./src/index.ts",
        output: [
            // "browser": "dist/hx-storage.js",
            // { file: pkg.browser, format: 'cjs', name: 'hxStorage', banner, footer, exports: "default" },
            
            { file: pkg.main, format: 'umd', name: 'hxStorage', banner, footer },
            { file: pkg.module, format: 'esm', name: 'hxStorage', banner, footer },
        ],
        external: ["crypto-js"],
        // globals: {
        //     CryptoJS: 'CryptoJS'
        // },
        plugins
    }
}


export default () => (
    [
        // getPackageConfig("index"),
        // getPackageConfig("utils/delay"),
        // getPackageConfig("utils/sleep"),
        hxStorageConfig()
    ]
)

