const util = require('util')
const balance = require('.')

const content = 'FOO ```BAR``` BAZ ```QUX```'

const result = balance(content, {
	open: '```',
	close: '```'
})

console.log(util.inspect(result, {
	showHidden: false,
	depth: null
}))

