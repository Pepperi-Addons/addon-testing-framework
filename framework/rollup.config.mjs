import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

export default [{
    input: 'index.ts',
    output: [{
        dir: './dist/',
        format: 'cjs'
    }],
    external: [
        "node-fetch",
    ],
    plugins: [
        typescriptPaths(),
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    module: "es2015",
                    declaration: false
                }
            }
        }),
        resolve({
            // browser: true,
        }),
        commonjs({

        }),
        json()
    ]
}];