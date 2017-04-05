module.exports = Translate

var preprocessPlural = require('./preprocess')

function Translate (dict) {
  translate.id = dict.id

  return translate

  function translate (key, data) {
    var value = dict.values[key]
    var hasData = data != null

    if (value === undefined) {
      throw new TypeError('translate: "' + key + '" not found in dictionary "' + translate.id + '".')
    }

    if (typeof value === 'object') {
      dict.values[key] = value = preprocessPlural(value)
    }

    if (typeof value === 'function') {
      var count = hasData ? data.count : undefined

      if (typeof count !== 'number') {
        throw new TypeError('translate: "' + key + '" is pluralized, second arg must be object with field {count: Number}.')
      }

      value = value(count)
    }

    if (hasData) {
      for (var templateKey in data) {
        value = value.replace(new RegExp('{{\\s*' + templateKey + '\\s*}}', 'g'), data[templateKey])
      }
    }

    return value
  }
}
