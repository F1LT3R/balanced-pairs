import test from 'ava'
import balance from '.'

// DEBUG
// import chromafi from 'chromafi'
import util from 'util'

test('flatten siblings w/ body replacements', t => {
	const source = '0{1}{2}3'
	const result = balance(source, {
		open: '{',
		close: '}'
	})

	result.blocks[0].children[0].updateBody('x')
	result.blocks[0].children[1].updateBody('y')
	const flattened = result.flatten()
	t.is(flattened, '0xy3')
})

test('flatten deep tree w/ body replacements', t => {
	const source = 'A{B{C}B}A'
	const result = balance(source, {
		open: '{',
		close: '}'
	})

	result.blocks[0].children[0].children[0].updateBody('_')
	const flattened = result.flatten()
	t.is(flattened, 'A{B_B}A')
})

test('flatten deep tree w/ simblings and body replacements', t => {
	const source = 'A{B{C}D{C}B}A'
	const result = balance(source, {
		open: '{',
		close: '}'
	})

	result.blocks[0].children[0].children[0].updateBody('_')
	const flattened = result.flatten()
	t.is(flattened, 'A{B_D_B}A')
})

test('flatten tree w/o body replacements', t => {
	const source = 'A{B{C}D{C}B}A'
	const result = balance(source, {
		open: '{',
		close: '}'
	})

	const flattened = result.flatten()
	t.is(flattened, 'A{B{C}D{C}B}A')
})

test('flatten tree shallow', t => {
	const source = '{A}'
	const result = balance(source, {
		open: '{',
		close: '}'
	})

	result.blocks[0].children[0].updateBody('X')
	const flattened = result.flatten()
	t.is(flattened, 'X')
})

test('flatten tree multi-delims', t => {
	const source = '{{A}}'
	const result = balance(source, {
		open: '{',
		close: '}'
	})

	result.blocks[0].children[0].children[0].updateBody('X')
	const flattened = result.flatten()
	t.is(flattened, '{X}')
})

test('flatten tree deep w/ colons', t => {
	const source = '{A:B{C:D{E:F{G:H}}}}'
	const result = balance(source, {
		open: '{',
		close: '}'
	})

	result.blocks[0]
		.children[0]
		.children[0]
		.children[0]
		.children[0].updateBody('_')
	const flattened = result.flatten()
	t.is(flattened, '{A:B{C:D{E:F_}}}')
})

test('flatten tree deep readme demo', t => {
	const source = '0{1{2{3{4}}}}'
	const result = balance(source, {
		open: '{',
		close: '}'
	})

	const block4 = result.blocks[0]
		.children[0]
		.children[0]
		.children[0]
		.children[0]

	block4.updateBody('[BEEP!]')

	const flattened = result.flatten()
	t.is(flattened, '0{1{2{3[BEEP!]}}}')
})

test('flatten inner content', t => {
	const source = '<p>{foo: {bar: "baz"}}</p>'
	const result = balance(source, {
		open: '{',
		close: '}'
	})

	result.blocks[0]
		.children[0]
		.children[0].updateBody('YYY')

	// DEBUG
	// console.log(util.inspect(result.blocks, {
	// 	showHidden: false,
	// 	depth: null
	// }))

	const flattened1 = result.flatten()
	t.is(flattened1, '<p>{foo: YYY}</p>')

	result.blocks[0].children[0].updateBody('XXX')
	const flattened2 = result.flatten()
	t.is(flattened2, '<p>XXX</p>')
})

