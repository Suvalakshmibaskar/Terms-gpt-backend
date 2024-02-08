/* eslint-disable @typescript-eslint/no-explicit-any */
module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"overrides": [
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"eqeqeq": [
			"error",
			"always"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"camelcase": ["error", {
			ignoreImports: true,
			ignoreDestructuring: true,
			ignoreGlobals: true,
			properties: "never"
		}],
		"@typescript-eslint/no-explicit-any": "error",
		"@typescript-eslint/no-unused-vars": "error"
	}
};
