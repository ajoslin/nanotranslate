function isNumberLike (key) {
  return Number(key) == key // eslint-disable-line
}

function numericSort (a, b) {
  return a - b
}

module.exports = function preprocessPlural (object) {
  var generated = [
    'if (o[n]) return o[n]'
  ]

  Object.keys(object).forEach(function (key) {
    // We're only processing ranges
    if (!/^-?\d+:-?\d+$/.test(key)) return

    var split = key.split(':').map(Number).sort(numericSort)

    // Put the boundaries of the range on the object so the fallbacks can read
    // the ranges as numbers
    object[split[0]] = object[split[1]] = object[key]

    generated.push(
      'if (n >= ' + split[0] + ' && n <= ' + split[1] + ') return o["' + key + '"]'
    )
  })

  var numberKeys = Object.keys(object).filter(isNumberLike).sort(numericSort)

  var max = numberKeys.pop()
  var min = numberKeys.length ? numberKeys.shift() : max
  object['*'] = object['*'] || object[max]
  object['-*'] = object['-*'] || object[min]

  // If the given count is not explicitly defined, use either the min or the max wildcard.
  // Use the max wildcard if it's closest to the max value or in the middle.
  // Otherwise, use the min wildcard.
  generated.push(
    'return ' + max + ' - n > n - ' + min + ' ? o["-*"] : o["*"]'
  )

  const pluralize = Function('o', 'n', generated.join('\n')) // eslint-disable-line

  return function pluralizeCount (count) {
    return pluralize(object, count)
  }
}
