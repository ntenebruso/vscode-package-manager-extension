import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';

module.exports = {
    input: 'svelte/app.js',
    output: {
        file: 'out/compiled/bundle.js',
        format: 'iife'
    },
    plugins: [
        svelte(),
        resolve({ browser: true })
    ]
}