const util = require('util')
const balance = require('.')

const content = 'FOO ```BAR``` BAZ ```QUX```'

const result = balance(content, {
	open: '```',
	close: '```'
})

// eslint-disable-next-line no-console
console.log(util.inspect(result, {
	showHidden: false,
	depth: null
}))

