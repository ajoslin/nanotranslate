'use strict'

var test = require('tape')
var Translate = require('./')

var translate = Translate({
  id: 'en_US',
  values: {
    PLAIN_STRING: 'hello',
    PLURALIZED_SIMPLE: [
      'Here are {{ count }}',
      'Here is {{ count }}',
      'And larger: {{ count }}'
    ],
    FN: ({ a, b, c }) => [a, b, c].join('|'),

    TEMPLATED: '{{foo}} {{   bar}} baz',

    APPLE: [
      'apples',
      'apple',
      'apples'
    ],
    COMPLEX: [
      'No {{item}} left.',
      'One {{item}} left.',
      '{{count}} {{item}} left.'
    ]
  }
})

test('basic', t => {
  t.equal(translate.id, 'en_US')
  t.equal(translate('PLAIN_STRING'), 'hello')
  t.end()
})

test('not found', t => {
  t.throws(() => translate('NOT_FOUND'), /"NOT_FOUND" not found/)
  t.end()
})

test('pluralized simple', t => {
  t.throws(() => translate('PLURALIZED_SIMPLE', {}), /pluralized/)
  t.throws(() => translate('PLURALIZED_SIMPLE', {count: 'not a number'}), /pluralized/)

  t.equal(translate('PLURALIZED_SIMPLE', {count: 0}), 'Here are 0')
  t.equal(translate('PLURALIZED_SIMPLE', {count: 1}), 'Here is 1')
  t.equal(translate('PLURALIZED_SIMPLE', {count: 2}), 'And larger: 2')
  t.equal(translate('PLURALIZED_SIMPLE', {count: 3}), 'And larger: 3')
  t.equal(translate('PLURALIZED_SIMPLE', {count: 999}), 'And larger: 999')
  t.equal(translate('PLURALIZED_SIMPLE', {count: 0}), 'Here are 0')
  t.equal(translate('PLURALIZED_SIMPLE', {count: -1}), 'Here is -1')
  t.equal(translate('PLURALIZED_SIMPLE', {count: -2}), 'And larger: -2')
  t.equal(translate('PLURALIZED_SIMPLE', {count: -3}), 'And larger: -3')
  t.end()
})

test('templates', t => {
  t.equal(translate('TEMPLATED', {foo: 1, bar: 2}), '1 2 baz')
  t.equal(translate('TEMPLATED', {bar: 2}), '{{foo}} 2 baz')
  t.end()
})

test('complex', t => {
  t.equal(
    translate('COMPLEX', {
      item: translate('APPLE', {count: 0}),
      count: 0
    }),
    'No apples left.'
  )

  t.equal(
    translate('COMPLEX', {
      item: translate('APPLE', {count: 1}),
      count: 1
    }),
    'One apple left.'
  )

  t.equal(
    translate('COMPLEX', {
      item: translate('APPLE', {count: 999}),
      count: 999
    }),
    '999 apples left.'
  )
  t.end()
})

test('function', t => {
  t.equal(
    translate('FN', {
      a: 1,
      b: 2
    }),
    '1|2|'
  )
  t.end()
})
