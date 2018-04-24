# Balanced-Pairs

> 🏄  get block contents between balanced pairs, eg: {} \<a>\</a> or code fences

[![Build Status](https://travis-ci.org/F1LT3R/balanced-pairs.svg?branch=master)](https://travis-ci.org/F1LT3R/balanced-pairs)
[![Coverage Status](https://coveralls.io/repos/github/F1LT3R/balanced-pairs/badge.svg?branch=master)](https://coveralls.io/github/F1LT3R/balanced-pairs?branch=master)
[![NPM Version](https://img.shields.io/npm/v/balanced-pairs.svg)](https://www.npmjs.com/package/balanced-pairs)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

## Install

```
# NPM
npm install --save balanced-pairs

# Yarn
yarn add balanced-pairs
```

## Uneven Pairs

An "Uneven Pair" is a pair of varying block delimiters. For example: HTML tags.

- Uneven pairs can be nested.
- Uneven pairs return:
	+ A nested tree of blocks.
	+ A linear array of blocks in the order they were closed.
	+ A object containing blocks mapped to their depth.
- An `inside(charPos)` function that returns all the nested blocks that the character is within.

```js
const balance = require('balanced-pairs')

const content = 'Foo <div>bar <div>baz</div></div> qux.'

const result = balance(content, {
	open: '<div>',
	close: '</div>'
})

console.log(result.blocks)
```

Result:

```js
{
  blocks: [{
    start: 0,
    end: 37,
    depth: 0,
    body: 'Foo <div>bar <div>baz</div></div> qux.',
    root: true,
    children: [{
      start: 9,
      end: 26,
      depth: 1,
      pre: 'Foo <div>',
      body: 'bar <div>baz</div>',
      post: '</div> qux.',
      root: false,
      delimiter: {
        start: 4,
        end: 32,
        pre: 'Foo ',
        body: '<div>bar <div>baz</div></div>',
        post: ' qux.'
      },
      children: [{
        start: 18,
        end: 20,
        depth: 2,
        pre: 'Foo <div>bar <div>',
        body: 'baz',
        post: '</div></div> qux.',
        root: false,
        delimiter: {
          start: 13,
          end: 26,
          pre: 'Foo <div>bar ',
          body: '<div>baz</div>',
          post: '</div> qux.'
        },
        children: []
      }]
    }]
  }],
  polygon: [],
  mode: 'odd',
  inside: [Function: inside],
  levels: {
    '1': [{
      start: 9,
      end: 26,
      depth: 1,
      pre: 'Foo <div>',
      body: 'bar <div>baz</div>',
      post: '</div> qux.',
      root: false,
      delimiter: {
        start: 4,
        end: 32,
        pre: 'Foo ',
        body: '<div>bar <div>baz</div></div>',
        post: ' qux.'
      },
      children: [{
        start: 18,
        end: 20,
        depth: 2,
        pre: 'Foo <div>bar <div>',
        body: 'baz',
        post: '</div></div> qux.',
        root: false,
        delimiter: {
          start: 13,
          end: 26,
          pre: 'Foo <div>bar ',
          body: '<div>baz</div>',
          post: '</div> qux.'
        },
        children: []
      }]
    }],
    '2': [{
      start: 18,
      end: 20,
      depth: 2,
      pre: 'Foo <div>bar <div>',
      body: 'baz',
      post: '</div></div> qux.',
      root: false,
      delimiter: {
        start: 13,
        end: 26,
        pre: 'Foo <div>bar ',
        body: '<div>baz</div>',
        post: '</div> qux.'
      },
      children: []
    }]
  },
  list: [{
    start: 18,
    end: 20,
    depth: 2,
    pre: 'Foo <div>bar <div>',
    body: 'baz',
    post: '</div></div> qux.',
    root: false,
    delimiter: {
      start: 13,
      end: 26,
      pre: 'Foo <div>bar ',
      body: '<div>baz</div>',
      post: '</div> qux.'
    },
    children: []
  }, {
    start: 9,
    end: 26,
    depth: 1,
    pre: 'Foo <div>',
    body: 'bar <div>baz</div>',
    post: '</div> qux.',
    root: false,
    delimiter: {
      start: 4,
      end: 32,
      pre: 'Foo ',
      body: '<div>bar <div>baz</div></div>',
      post: ' qux.'
    },
    children: [{
      start: 18,
      end: 20,
      depth: 2,
      pre: 'Foo <div>bar <div>',
      body: 'baz',
      post: '</div></div> qux.',
      root: false,
      delimiter: {
        start: 13,
        end: 26,
        pre: 'Foo <div>bar ',
        body: '<div>baz</div>',
        post: '</div> qux.'
      },
      children: []
    }]
  }]
}
```


## Even Pairs

An "Even Pair" is a pair of identical block delimiters. For example: a markdown code-fence.

- Even pairs do not nest.
- Even pairs return a linear array of blocks.
- Even pairs return a polygon that can be used to determine whether any character position is inside or outside of a block.
- An `inside(charPos)` function to check whether any character is within a block.

Example:

```js
const balance = require('balanced-pairs')

const content = 'FOO ```BAR``` BAZ ```QUX```'

const result = balance(content, {
	open: '```',
	close: '```'
})

console.log(result.blocks)
```

Result:

```js
  [ { start: 7,
       end: 9,
       pre: 'FOO ```',
       body: 'BAR',
       post: '``` BAZ ```QUX```',
       polygon: [ [ 7, -1 ], [ 10, -1 ], [ 10, 1 ], [ 7, 1 ], [ 7, -1 ] ],
       delimiter:
        { start: 4,
          end: 12,
          pre: 'FOO ',
          body: '```BAR```',
          post: '``` BAZ ```QUX```' } },
     { start: 21,
       end: 23,
       pre: 'FOO ```BAR``` BAZ ```',
       body: 'QUX',
       post: '```',
       polygon: [ [ 21, -1 ], [ 24, -1 ], [ 24, 1 ], [ 21, 1 ], [ 21, -1 ] ],
       delimiter:
        { start: 18,
          end: 26,
          pre: 'FOO ```BAR``` BAZ ',
          body: '```QUX```',
          post: '```' } } ],
  polygon:
   [ [ 7, -1 ],
     [ 10, -1 ],
     [ 10, 1 ],
     [ 7, 1 ],
     [ 7, -1 ],
     [ 21, -1 ],
     [ 24, -1 ],
     [ 24, 1 ],
     [ 21, 1 ],
     [ 21, -1 ] ],
  mode: 'even',
  inside: [Function: inside] }
```
