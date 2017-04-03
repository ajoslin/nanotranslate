module.exports = Translate

function Translate (dict) {
  translate.id = dict.id

  return translate

  function translate (key, data) {
    var value = dict.values[key]
    data = data || {}

    if (value === undefined) {
      throw new TypeError('translate: ' + key + ' not found in dictionary "' + dict.name + '".')
    }

    if (Array.isArray(value)) {
      if (typeof data.count !== 'number') {
        throw new TypeError('translate: ' + key + ' is pluralized, second argument must be an object with field "count" as a number.')
      }
      value = value[Math.abs(data.count)] || value[value.length - 1]
    }

    for (var templateKey in data) {
      value = value.replace(new RegExp('{{\\s*' + templateKey + '\\s*}}', 'g'), data[templateKey])
    }

    return value
  }
}
