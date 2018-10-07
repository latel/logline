import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.ts',
		output: {
			name: pkg.name,
			file: pkg.main,
			format: 'umd'
		},
		plugins: [
			resolve(),
            commonjs(),
            typescript({
                verbosity: 0,
            }),
		]
	},
];
