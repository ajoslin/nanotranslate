module.exports = Translate

function Translate (dict) {
  translate.id = dict.id

  return translate

  function translate (key, data) {
    var value = dict.values[key]

    if (value === undefined) {
      throw new TypeError('translate: "' + key + '" not found in dictionary "' + translate.id + '".')
    }

    if (Array.isArray(value)) {
      var count = data != null ? data.count : undefined

      if (typeof count !== 'number') {
        throw new TypeError('translate: "' + key + '" is pluralized, second argument must be an object with field "count" as a number.')
      }

      value = value[Math.abs(count)] || value[value.length - 1]
    }

    if (typeof value === 'function') {
      return value(data)
    }

    for (var templateKey in data) {
      value = value.replace(new RegExp('{{\\s*' + templateKey + '\\s*}}', 'g'), data[templateKey])
    }

    return value
  }
}
