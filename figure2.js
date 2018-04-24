const util = require('util')
const balance = require('.')

const content = 'Foo <div>bar <div>baz</div></div> qux.'

const result = balance(content, {
	open: '<div>',
	close: '</div>'
})

console.log(util.inspect(result, {
	showHidden: false,
	depth: null
}))

