import test from 'ava'
import balance from '.'

// DEBUG
// import chromafi from 'chromafi'

test('get balance blocks and polygon', t => {
	const source = '```ALL ```NIGHT``` LONG```'

	// DEBUG
	// console.log(   '01234567890123456789012345')
	// console.log(source)

	const fence = '```'

	const result = balance(source, {
		open: fence,
		close: fence
	})

	const expectedBlocks = [
		{
			start: 3,
			end: 6,
			pre: '```',
			body: 'ALL ',
			post: '```NIGHT``` LONG```',
			polygon: [[3, -1], [7, -1], [7, 1], [3, 1], [3, -1]],
			delimiter: {
				start: 0,
				end: 9,
				pre: '',
				body: '```ALL ```',
				post: '```NIGHT``` LONG```'
			}
		},
		{
			start: 18,
			end: 22,
			pre: '```ALL ```NIGHT```',
			body: ' LONG',
			post: '```',
			polygon: [[18, -1], [23, -1], [23, 1], [18, 1], [18, -1]],
			delimiter: {
				start: 15,
				end: 25,
				pre: '```ALL ```NIGHT',
				body: '``` LONG```',
				post: '```'
			}
		}
	]

	// DEBUG
	// console.log(chromafi(expectedBlocks, {lineNumbers: false, codePad: 0}))
	// console.log(chromafi(result.blocks, {lineNumbers: false, codePad: 0} ))

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
