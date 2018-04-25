import test from 'ava'
import balance from '.'

// DEBUG
// import chromafi from 'chromafi'
// import util from 'util'

const deleteFns = block => {
	delete block.updateBody
	block.children.forEach(child => deleteFns(child))
}

test('get balanced nested curly braces', t => {
	const source = 'A{B}A'

	// Debug
	// const source = 'A{B}C'
	// console.log(   '01234567890123456')

	const result = balance(source, {
		open: '{',
		close: '}'
	})

	// Debug
	// console.log(chromafi(result, {lineNumbers: false, codePad: 0}))

	const expectedBlocks = [{
		start: 0,
		end: 4,
		depth: 0,
		body: 'A{B}A',
		root: true,
		children: [{
			start: 2,
			end: 2,
			depth: 1,
			pre: 'A{',
			body: 'B',
			post: '}A',
			root: false,
			delimiter: {
				start: 1,
				end: 3,
				pre: 'A',
				body: '{B}',
				post: 'A'
			},
			children: []
		}]
	}]

	deleteFns(result.blocks[0])

	// // DEBUG
	// console.log(util.inspect(result.blocks, {
	// 	showHidden: false,
	// 	depth: null
	// }))

	t.deepEqual(expectedBlocks, result.blocks)
})

test('get deep balanced nested curly braces', t => {
	const source = 'A{B{C{D{E}D}C}B}A'

	// DEBUG
	// const source = 'A{B}C'
	// console.log('01234567890123456')
	// console.log(source)

	const result = balance(source, {
		open: '{',
		close: '}'
	})

	deleteFns(result.blocks[0])

	// DEBUG
	// console.log(chromafi(result, {lineNumbers: false, codePad: 0}))

	const expectedBlocks = [{
		start: 0,
		end: 16,
		depth: 0,
		body: 'A{B{C{D{E}D}C}B}A',
		root: true,
		children: [{
			start: 2,
			end: 14,
			depth: 1,
			pre: 'A{',
			body: 'B{C{D{E}D}C}B',
			post: '}A',
			children: [{
				start: 4,
				end: 12,
				depth: 2,
				pre: 'A{B{',
				body: 'C{D{E}D}C',
				post: '}B}A',
				children: [{
					start: 6,
					end: 10,
					depth: 3,
					pre: 'A{B{C{',
					body: 'D{E}D',
					post: '}C}B}A',
					children: [{
						start: 8,
						end: 8,
						depth: 4,
						pre: 'A{B{C{D{',
						body: 'E',
						post: '}D}C}B}A',
						children: [],
						root: false,
						delimiter: {
							start: 7,
							end: 9,
							pre: 'A{B{C{D',
							body: '{E}',
							post: 'D}C}B}A'
						}
					}],
					root: false,
					delimiter: {
						start: 5,
						end: 11,
						pre: 'A{B{C',
						body: '{D{E}D}',
						post: 'C}B}A'
					}
				}],
				root: false,
				delimiter: {
					start: 3,
					end: 13,
					pre: 'A{B',
					body: '{C{D{E}D}C}',
					post: 'B}A'
				}
			}],
			root: false,
			delimiter: {
				start: 1,
				end: 15,
				pre: 'A',
				body: '{B{C{D{E}D}C}B}',
				post: 'A'
			}
		}]
	}]

	t.deepEqual(expectedBlocks, result.blocks)

	const expectedLevels = [
		[{
			start: 0,
			end: 16,
			depth: 0,
			body: 'A{B{C{D{E}D}C}B}A',
			root: true,
			children: [{
				start: 2,
				end: 14,
				depth: 1,
				pre: 'A{',
				body: 'B{C{D{E}D}C}B',
				post: '}A',
				root: false,
				delimiter: {
					start: 1,
					end: 15,
					pre: 'A',
					body: '{B{C{D{E}D}C}B}',
					post: 'A'
				},
				children: [{
					start: 4,
					end: 12,
					depth: 2,
					pre: 'A{B{',
					body: 'C{D{E}D}C',
					post: '}B}A',
					root: false,
					delimiter: {
						start: 3,
						end: 13,
						pre: 'A{B',
						body: '{C{D{E}D}C}',
						post: 'B}A'
					},
					children: [{
						start: 6,
						end: 10,
						depth: 3,
						pre: 'A{B{C{',
						body: 'D{E}D',
						post: '}C}B}A',
						root: false,
						delimiter: {
							start: 5,
							end: 11,
							pre: 'A{B{C',
							body: '{D{E}D}',
							post: 'C}B}A'
						},
						children: [{
							start: 8,
							end: 8,
							depth: 4,
							pre: 'A{B{C{D{',
							body: 'E',
							post: '}D}C}B}A',
							root: false,
							delimiter: {
								start: 7,
								end: 9,
								pre: 'A{B{C{D',
								body: '{E}',
								post: 'D}C}B}A'
							},
							children: []
						}]
					}]
				}]
			}]
		}],
		[{
			start: 2,
			end: 14,
			depth: 1,
			pre: 'A{',
			body: 'B{C{D{E}D}C}B',
			post: '}A',
			root: false,
			delimiter: {
				start: 1,
				end: 15,
				pre: 'A',
				body: '{B{C{D{E}D}C}B}',
				post: 'A'
			},
			children: [{
				start: 4,
				end: 12,
				depth: 2,
				pre: 'A{B{',
				body: 'C{D{E}D}C',
				post: '}B}A',
				root: false,
				delimiter: {
					start: 3,
					end: 13,
					pre: 'A{B',
					body: '{C{D{E}D}C}',
					post: 'B}A'
				},
				children: [{
					start: 6,
					end: 10,
					depth: 3,
					pre: 'A{B{C{',
					body: 'D{E}D',
					post: '}C}B}A',
					root: false,
					delimiter: {
						start: 5,
						end: 11,
						pre: 'A{B{C',
						body: '{D{E}D}',
						post: 'C}B}A'
					},
					children: [{
						start: 8,
						end: 8,
						depth: 4,
						pre: 'A{B{C{D{',
						body: 'E',
						post: '}D}C}B}A',
						root: false,
						delimiter: {
							start: 7,
							end: 9,
							pre: 'A{B{C{D',
							body: '{E}',
							post: 'D}C}B}A'
						},
						children: []
					}]
				}]
			}]
		}],
		[{
			start: 4,
			end: 12,
			depth: 2,
			pre: 'A{B{',
			body: 'C{D{E}D}C',
			post: '}B}A',
			root: false,
			delimiter: {
				start: 3,
				end: 13,
				pre: 'A{B',
				body: '{C{D{E}D}C}',
				post: 'B}A'
			},
			children: [{
				start: 6,
				end: 10,
				depth: 3,
				pre: 'A{B{C{',
				body: 'D{E}D',
				post: '}C}B}A',
				root: false,
				delimiter: {
					start: 5,
					end: 11,
					pre: 'A{B{C',
					body: '{D{E}D}',
					post: 'C}B}A'
				},
				children: [{
					start: 8,
					end: 8,
					depth: 4,
					pre: 'A{B{C{D{',
					body: 'E',
					post: '}D}C}B}A',
					root: false,
					delimiter: {
						start: 7,
						end: 9,
						pre: 'A{B{C{D',
						body: '{E}',
						post: 'D}C}B}A'
					},
					children: []
				}]
			}]
		}],
		[{
			start: 6,
			end: 10,
			depth: 3,
			pre: 'A{B{C{',
			body: 'D{E}D',
			post: '}C}B}A',
			root: false,
			delimiter: {
				start: 5,
				end: 11,
				pre: 'A{B{C',
				body: '{D{E}D}',
				post: 'C}B}A'
			},
			children: [{
				start: 8,
				end: 8,
				depth: 4,
				pre: 'A{B{C{D{',
				body: 'E',
				post: '}D}C}B}A',
				root: false,
				delimiter: {
					start: 7,
					end: 9,
					pre: 'A{B{C{D',
					body: '{E}',
					post: 'D}C}B}A'
				},
				children: []
			}]
		}],
		[{
			start: 8,
			end: 8,
			depth: 4,
			pre: 'A{B{C{D{',
			body: 'E',
			post: '}D}C}B}A',
			root: false,
			delimiter: {
				start: 7,
				end: 9,
				pre: 'A{B{C{D',
				body: '{E}',
				post: 'D}C}B}A'
			},
			children: []
		}]
	]

	t.deepEqual(expectedLevels, result.levels)

	// console.log(util.inspect(result.levels, {
	// 	showHidden: false,
	// 	depth: null
	// }))

	// DEBUG
	// console.log(util.inspect(result.list, {
	// 	showHidden: false,
	// 	depth: null
	// }))

	const expectedList = [{
		start: 8,
		end: 8,
		depth: 4,
		pre: 'A{B{C{D{',
		body: 'E',
		post: '}D}C}B}A',
		root: false,
		delimiter: {
			start: 7,
			end: 9,
			pre: 'A{B{C{D',
			body: '{E}',
			post: 'D}C}B}A'
		},
		children: []
	}, {
		start: 6,
		end: 10,
		depth: 3,
		pre: 'A{B{C{',
		body: 'D{E}D',
		post: '}C}B}A',
		root: false,
		delimiter: {
			start: 5,
			end: 11,
			pre: 'A{B{C',
			body: '{D{E}D}',
			post: 'C}B}A'
		},
		children: [{
			start: 8,
			end: 8,
			depth: 4,
			pre: 'A{B{C{D{',
			body: 'E',
			post: '}D}C}B}A',
			root: false,
			delimiter: {
				start: 7,
				end: 9,
				pre: 'A{B{C{D',
				body: '{E}',
				post: 'D}C}B}A'
			},
			children: []
		}]
	}, {
		start: 4,
		end: 12,
		depth: 2,
		pre: 'A{B{',
		body: 'C{D{E}D}C',
		post: '}B}A',
		root: false,
		delimiter: {
			start: 3,
			end: 13,
			pre: 'A{B',
			body: '{C{D{E}D}C}',
			post: 'B}A'
		},
		children: [{
			start: 6,
			end: 10,
			depth: 3,
			pre: 'A{B{C{',
			body: 'D{E}D',
			post: '}C}B}A',
			root: false,
			delimiter: {
				start: 5,
				end: 11,
				pre: 'A{B{C',
				body: '{D{E}D}',
				post: 'C}B}A'
			},
			children: [{
				start: 8,
				end: 8,
				depth: 4,
				pre: 'A{B{C{D{',
				body: 'E',
				post: '}D}C}B}A',
				root: false,
				delimiter: {
					start: 7,
					end: 9,
					pre: 'A{B{C{D',
					body: '{E}',
					post: 'D}C}B}A'
				},
				children: []
			}]
		}]
	}, {
		start: 2,
		end: 14,
		depth: 1,
		pre: 'A{',
		body: 'B{C{D{E}D}C}B',
		post: '}A',
		root: false,
		delimiter: {
			start: 1,
			end: 15,
			pre: 'A',
			body: '{B{C{D{E}D}C}B}',
			post: 'A'
		},
		children: [{
			start: 4,
			end: 12,
			depth: 2,
			pre: 'A{B{',
			body: 'C{D{E}D}C',
			post: '}B}A',
			root: false,
			delimiter: {
				start: 3,
				end: 13,
				pre: 'A{B',
				body: '{C{D{E}D}C}',
				post: 'B}A'
			},
			children: [{
				start: 6,
				end: 10,
				depth: 3,
				pre: 'A{B{C{',
				body: 'D{E}D',
				post: '}C}B}A',
				root: false,
				delimiter: {
					start: 5,
					end: 11,
					pre: 'A{B{C',
					body: '{D{E}D}',
					post: 'C}B}A'
				},
				children: [{
					start: 8,
					end: 8,
					depth: 4,
					pre: 'A{B{C{D{',
					body: 'E',
					post: '}D}C}B}A',
					root: false,
					delimiter: {
						start: 7,
						end: 9,
						pre: 'A{B{C{D',
						body: '{E}',
						post: 'D}C}B}A'
					},
					children: []
				}]
			}]
		}]
	}]

	t.deepEqual(expectedList, result.list)
	// '01234567890123456'
	// 'A{B{C{D{E}D}C}B}A'

	const center = 8
	const blocksInside = result.inside(center)

	t.is(blocksInside[0].body, 'E')
	t.is(blocksInside[1].body, 'D{E}D')
	t.is(blocksInside[2].body, 'C{D{E}D}C')
	t.is(blocksInside[3].body, 'B{C{D{E}D}C}B')
})

test('get balanced tag', t => {
	//              012345678901234567890
	const source = 'ALL <a>NIGHT</a> LONG'

	const result = balance(source, {
		open: '<a>',
		close: '</a>'
	})

	deleteFns(result.blocks[0])

	const expectedBlocks = [{
		start: 0,
		end: 20,
		depth: 0,
		body: 'ALL <a>NIGHT</a> LONG',
		root: true,
		children: [{
			start: 7,
			end: 11,
			depth: 1,
			pre: 'ALL <a>',
			body: 'NIGHT',
			post: '</a> LONG',
			root: false,
			delimiter: {
				start: 4,
				end: 15,
				pre: 'ALL ',
				body: '<a>NIGHT</a>',
				post: ' LONG'
			},
			children: []
		}]
	}]

	t.deepEqual(expectedBlocks, result.blocks)

	// // Debug
	// console.log(util.inspect(result, {
	// 	showHidden: false,
	// 	depth: null
	// }))
})

test('get deep balanced double-parens', t => {
	//              0123456789012345678901234567890
	const source = '((ALL((THE((GOOD))NIGHT))LONG))'

	const result = balance(source, {
		open: '((',
		close: '))'
	})

	deleteFns(result.blocks[0])

	const expectedBlocks = [{
		start: 0,
		end: 30,
		depth: 0,
		body: '((ALL((THE((GOOD))NIGHT))LONG))',
		root: true,
		children: [{
			start: 2,
			end: 28,
			depth: 1,
			pre: '((',
			body: 'ALL((THE((GOOD))NIGHT))LONG',
			post: '))',
			root: false,
			delimiter: {
				start: 0,
				end: 30,
				pre: '',
				body: '((ALL((THE((GOOD))NIGHT))LONG))',
				post: ''
			},
			children: [{
				start: 7,
				end: 22,
				depth: 2,
				pre: '((ALL((',
				body: 'THE((GOOD))NIGHT',
				post: '))LONG))',
				root: false,
				delimiter: {
					start: 5,
					end: 24,
					pre: '((ALL',
					body: '((THE((GOOD))NIGHT))',
					post: 'LONG))'
				},
				children: [{
					start: 12,
					end: 15,
					depth: 3,
					pre: '((ALL((THE((',
					body: 'GOOD',
					post: '))NIGHT))LONG))',
					root: false,
					delimiter: {
						start: 10,
						end: 17,
						pre: '((ALL((THE',
						body: '((GOOD))',
						post: 'NIGHT))LONG))'
					},
					children: []
				}]
			}]
		}]
	}]

	t.deepEqual(expectedBlocks, result.blocks)

	// // Debug
	// console.log(util.inspect(result, {
	// 	showHidden: false,
	// 	depth: null
	// }))
})
