'use strict'

var test = require('tape')
var Translate = require('./')

test('basic', t => {
  var T = Translate({
    id: 'en_US',
    values: {
      STRING: 'hi there',
      TEMPLATED: '{{foo}} {{   bar}} baz',
      TEMPLATED_COUNT: 'you can use count in templates too: {{count}}'
    }
  })

  t.throws(() => T('NOT_FOUND'), /"NOT_FOUND" not found in dictionary "en_US"/)

  t.equal(T('STRING'), 'hi there')
  t.equal(T('TEMPLATED'), '{{foo}} {{   bar}} baz')
  t.equal(T('TEMPLATED', {foo: 1, bar: 2}), '1 2 baz')
  t.equal(T('TEMPLATED', {bar: 2}), '{{foo}} 2 baz')
  t.equal(T('TEMPLATED_COUNT', {count: 333}), 'you can use count in templates too: 333')
  t.end()
})

test('advanced pluralization', t => {
  var T = Translate({
    values: {
      PLURAL: {
        '-*': 'And smaller: {{count}}.',
        '-3:-6': 'Range -3:-6',
        0: 'Here are {{ count }}',
        1: 'Here is {{ count }}',
        '5:10': 'Five to 10 {{count}}',
        '*': 'And larger: {{ count }}'
      }
    }
  })

  t.throws(() => T('PLURAL', {}), /pluralized/)
  t.throws(() => T('PLURAL', {count: 'not a number'}), /pluralized/)

  t.equal(T('PLURAL', {count: 0}), 'Here are 0')
  t.equal(T('PLURAL', {count: 1}), 'Here is 1')
  t.equal(T('PLURAL', {count: 2}), 'And larger: 2')
  t.equal(T('PLURAL', {count: 999}), 'And larger: 999')
  t.equal(T('PLURAL', {count: 4}), 'And larger: 4')
  for (var i = 5; i <= 10; i++) {
    t.equal(T('PLURAL', {count: i}), 'Five to 10 ' + i)
  }
  t.equal(T('PLURAL', {count: 11}), 'And larger: 11')
  t.equal(T('PLURAL', {count: -2}), 'And smaller: -2.')
  for (var j = -3; j >= -6; j--) {
    t.equal(T('PLURAL', {count: j}), 'Range -3:-6')
  }
  t.equal(T('PLURAL', {count: -7}), 'And smaller: -7.')
  t.end()
})

test('complex', t => {
  var T = Translate({
    values: {
      APPLE: [
        'apples',
        'apple',
        'apples'
      ],
      COMPLEX: {
        0: 'No {{item}} left.',
        1: 'One {{item}} left.',
        '2:10': 'A good amount of {{item}} left.',
        '*': 'Way too many {{item}} left.'
      }
    }
  })

  t.equal(
    T('COMPLEX', {
      item: T('APPLE', {count: 0}),
      count: 0
    }),
    'No apples left.'
  )

  t.equal(
    T('COMPLEX', {
      item: T('APPLE', {count: 1}),
      count: 1
    }),
    'One apple left.'
  )

  t.equal(
    T('COMPLEX', {
      item: T('APPLE', {count: 4}),
      count: 4
    }),
    'A good amount of apples left.'
  )

  t.equal(
    T('COMPLEX', {
      item: T('APPLE', {count: 14}),
      count: 14
    }),
    'Way too many apples left.'
  )
  t.end()
})

test('holes with wildcards choose the closest', t => {
  const T = Translate({
    values: {
      HOLES: {
        '-*': 'min',
        '-3:-2': 'neg range',
        '3': 'three',
        '*': 'max'
      }
    }
  })

  t.equal(T('HOLES', {count: -4}), 'min')
  t.equal(T('HOLES', {count: -3}), 'neg range')
  t.equal(T('HOLES', {count: -2}), 'neg range')
  t.equal(T('HOLES', {count: -1}), 'min')
  t.equal(T('HOLES', {count: 0}), 'max')
  t.equal(T('HOLES', {count: 1}), 'max')
  t.equal(T('HOLES', {count: 2}), 'max')
  t.equal(T('HOLES', {count: 3}), 'three')
  t.equal(T('HOLES', {count: 4}), 'max')
  t.end()
})

test('edgecases', t => {
  var T = Translate({
    values: {
      SAME_MIN_MAX: {
        0: 'hi'
      },
      MIN_0: {
        0: 'min0',
        1: 'max1'
      },
      OVERLAPPING_RANGES: {
        '1:3': 'one three',
        '3:5': 'three five'
      },
      WILDCARDS: {
        '-*': 'min',
        1: 'mid',
        '*': 'max'
      }
    }
  })
  t.equal(T('SAME_MIN_MAX', {count: -1}), 'hi')
  t.equal(T('SAME_MIN_MAX', {count: 0}), 'hi')
  t.equal(T('SAME_MIN_MAX', {count: 1}), 'hi')

  t.equal(T('MIN_0', {count: -1}), 'min0')
  t.equal(T('MIN_0', {count: 0}), 'min0')
  t.equal(T('MIN_0', {count: 1}), 'max1')
  t.equal(T('MIN_0', {count: 2}), 'max1')

  t.equal(T('OVERLAPPING_RANGES', {count: 0}), 'one three')
  t.equal(T('OVERLAPPING_RANGES', {count: 1}), 'one three')
  t.equal(T('OVERLAPPING_RANGES', {count: 2}), 'one three')
  t.equal(T('OVERLAPPING_RANGES', {count: 3}), 'three five')
  t.equal(T('OVERLAPPING_RANGES', {count: 4}), 'three five')
  t.equal(T('OVERLAPPING_RANGES', {count: 5}), 'three five')
  t.equal(T('OVERLAPPING_RANGES', {count: 6}), 'three five')

  t.equal(T('WILDCARDS', {count: 0}), 'min')
  t.equal(T('WILDCARDS', {count: 1}), 'mid')
  t.equal(T('WILDCARDS', {count: 2}), 'max')
  t.end()
})
