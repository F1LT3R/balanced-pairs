import test from 'ava'
import balance from '.'
import chromafi from 'chromafi'

test('get balance blocks and polygon', t => {
	const source = '```ALL ```NIGHT``` LONG```'

	const fence = '```'

	const result = balance(source, {
		open: fence,
		close: fence
	})

	const expectedBlocks = [
		{
			start: 3,
			end: 7,
			pre: '```',
			body: 'ALL ',
			post: '```NIGHT``` LONG```',
			delimiter: {
				start: 0,
				end: 9,
				pre: '',
				body: '```ALL ```',
				post: 'NIGHT``` LONG```'
			}
		},
		{
			start: 18,
			end: 23,
			pre: '```ALL ```NIGHT```',
			body: ' LONG',
			post: '```',
			delimiter: {
				start: 15,
				end: 25,
				pre: '```ALL ```NIGHT',
				body: '``` LONG```',
				post: ''
			}
		}
	]

	t.deepEqual(result.blocks, expectedBlocks)

	const expectedPolygon = [
		[3, -1],
		[7, -1],
		[7, 1],
		[3, 1],
		[3, -1],
		[18, -1],
		[23, -1],
		[23, 1],
		[18, 1],
		[18, -1]
	]

	t.deepEqual(result.polygon, expectedPolygon)

	//            '01234567890123456789012345'
	//            '```ALL ```NIGHT``` LONG```'
	const truth = '00011110000000000011111000'
	const table = [false, true]
	truth.split('').forEach((fact, i) => {
		t.is(table[fact], result.inside(i))
	})
})

test('get balanced html', t => {
	const source = 'ALL <a>NIGHT</a> LONG'

	const result = balance(source, {
		open: '<a>',
		close: '</a>'
	})

	const expectedBlocks = [{
		start: 7,
		end: 12,
		pre: 'ALL <a>',
		body: 'NIGHT',
		post: '</a> LONG',
		delimiter: {
			start: 4,
			end: 15,
			pre: 'ALL ',
			body: '<a>NIGHT</a>',
			post: ' LONG'
		}
	}]

	t.deepEqual(expectedBlocks, result.blocks)
})

test('get balanced curly braces', t => {
	const source = 'ALL {NIGHT} LONG'

	const result = balance(source, {
		open: '{',
		close: '}'
	})

	const expectedBlocks = [{
		start: 5,
		end: 10,
		pre: 'ALL {',
		body: 'NIGHT',
		post: '} LONG',
		delimiter: {
			start: 4,
			end: 10,
			pre: 'ALL ',
			body: '{NIGHT}',
			post: ' LONG'
		}
	}]

	t.deepEqual(expectedBlocks, result.blocks)
})

test.only('get balanced nested curly braces', t => {
	const source = '{ALL {THE {GOOD} NIGHT} LONG}'

	const result = balance(source, {
		open: '{',
		close: '}'
	})

	console.log(chromafi(result.blocks, {lineNumbers: false, codePad: 0}))

	// const expectedBlocks = [{
	// 	start: 5,
	// 	end: 10,
	// 	pre: 'ALL {',
	// 	body: 'NIGHT',
	// 	post: '} LONG',
	// 	delimiter: {
	// 		start: 4,
	// 		end: 10,
	// 		pre: 'ALL ',
	// 		body: '{NIGHT}',
	// 		post: ' LONG'
	// 	}
	// }]

	// t.deepEqual(expectedBlocks, result.blocks)
})

