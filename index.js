const superSplit = require('super-split')
const pointInPolygon = require('point-in-polygon')
const chromafi = require('chromafi')

const resolveRun = (run, body, content) => {
	const start = run[0]
	const end = run[1]

	const polygon = [
		[start - 0, -1],
		[end + 0, -1],
		[end + 0, 1],
		[start - 0, 1],
		// Close poly
		[start - 0, -1]
	]

	const block = {
		start,
		end,
		pre: content.substr(0, start),
		body: body,
		post: content.substr(end),
		polygon,
		delimiter: {
			start: start - openLen,
			end: end + closeLen - 1,
			pre: content.substr(0, start - openLen),
			body: opts.open + body + opts.close,
			post: content.substr(end + closeLen)
		}
	}

	return block
}

class Block {
	constructor (start, parent = null) {
		this.start = start
		this.children = []
		this.parent = parent
		this.body = ''
		this.end = null
	}

	close (index, content) {
		this.end = index
		this.body = content.substr(this.start, this.end)
	}
}

module.exports = (content, opts) => {
	console.log(content)
	const delims = [opts.open, opts.close]
	const particle = superSplit(content, delims)
	const openLen = opts.open.length
	const closeLen = opts.close.length
	const evenDelims = opts.open === opts.close

	const firstOpen = particle.indexOf(opts.open)
	const firstClose = particle.indexOf(opts.close)

	const result = {
		blocks: [],
		polygon: [],
		inside: n => {
			return pointInPolygon([n, 0], result.polygon)
		}
	}

	let run = []
	let n = 0
	let on = evenDelims ? false : firstOpen > firstClose

	let openDepth = 0
	const stack = []
	let currentItem = {children: []}
	stack.push(currentItem)

	particle.forEach((atom, i) => {
		if (!delims.includes(atom)) {
			n += atom.length
			return
		}

		if (evenDelims === false) {
			let currentItem = stack[stack.length - 1] || undefined

			if (atom === opts.open) {
				openDepth += 1
				const blockStart = n + openLen
				// const nextItem = new Block(blockStart, currentItem)
				const nextItem = new Block(blockStart, null)
				if (currentItem) {
					currentItem.children.push(nextItem)
				}
				stack.push(nextItem)
				// currentItem = nextItem
			}

			if (atom === opts.close) {
				openDepth -= 1
				if (currentItem) {
					const n2 = n - (closeLen)
					currentItem.close(n2, content)
					stack.pop()
				}
			}
		}

		if (evenDelims) {
			on = !on
			const n2 = on ? n + openLen : n
			run.push(n2)
			const body = particle[i - 1]
			if (run.length === 2) {
				const block = resolveRun(run, body, content)
				result.blocks.push(block)
				result.polygon.concat(block.polygon)
				run = []
			}
			return
		}

		n += atom.length
	})

	console.log(stack[0])
	console.log()
	console.log(stack[0].children[0].body)
	console.log()
	console.log(stack[0].children[0].children[0].body)

	return result
}
