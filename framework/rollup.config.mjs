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
        // "node-fetch", // node-fetch should be an external dependency, but the Lambda puts it in a different place
        // // until this is fixed, we'll just bundle it
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