# nanotranslate [![Build Status](https://travis-ci.org/ajoslin/nanotranslate.svg?branch=master)](https://travis-ci.org/ajoslin/nanotranslate)

> Translate with pluralization and variables in under 600b.

## Install

```
$ npm install --save nanotranslate
```

## Usage

```js
var Translate = require('nanotranslate')

var translate = Translate({
  id: 'en_US',
  values: {
    SIMPLE: 'simple string',
    TEMPLATED: 'simple {{value}} string',
    PLURAL: [
      'Zero items left.',
      'One item left.',
      '{{count}} items left, {{name}}.'
    ]
  }
})

translate('SIMPLE') // => 'simple string'
translate('TEMPLATED', {value: 'hello'}) // => 'simple hello string'
translate('PLURAL', {count: 1}) // => 'Zero items left.'
translate('PLURAL', {count: 2}) // => 'One item left.'
translate('PLURAL', {count: 3, name: 'Alex'}) // => '3 items left, Alex.'
```

## License

MIT © [Andrew Joslin](http://ajoslin.com)
