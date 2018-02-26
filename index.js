
module.exports = Nanotranslate

function Nanotranslate (dict) {
  // if (!dict.id) throw new Error('Nanotranslate: dict.id required')
  if (!dict.values) throw new Error('Nanotranslate: dict.values required')

  translate.id = dict.id
  function translate (key, data) {
    return Nanotranslate.run(dict, key, data)
  }

  return translate
}

Nanotranslate.run = function runTranslate (dict, key, data) {
  var value = dict.values[key]

  if (value === undefined) {
    throw new TypeError('translate: "' + key + '" not found in dictionary "' + dict.id + '".')
  }

  if (Array.isArray(value)) {
    var count = data != null ? data.count : undefined

    if (typeof count !== 'number') {
      throw new TypeError('translate: "' + key + '" is pluralized, second argument must be an object with field "count" as a number.')
    }

    value = value[Math.abs(count)] || value[value.length - 1]
  }

  for (var templateKey in data) {
    value = value.replace(new RegExp('{{\\s*' + templateKey + '\\s*}}', 'g'), data[templateKey])
  }

  return value
}
