// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from "@rollup/plugin-terser";

export default {
    input: 'index.js',
    output: {
        file: 'dist/cm6-yaml-editor.js',
        format: 'iife'  
    },
    plugins: [nodeResolve({
        browser: true
    }), terser({
        compress: { drop_console: true, passes: 2 },
        format: { comments: false }
    })]
};
