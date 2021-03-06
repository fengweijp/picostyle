var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet

function hyphenate (str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function insert (rule) {
  sheet.insertRule(rule, 0)
}

function createRule (className, decls, media) {
  var newDecls = []
  for (var property in decls) {
    newDecls.push(hyphenate(property) + ":" + decls[property] + ";")
  }
  var rule = "." + className + "{" + newDecls.join("") + "}"
  return media ? media + "{" + rule + "}" : rule
}

function parse (decls, child, media, className) {
  child = child || ""
  className = className || "p" + (_id++).toString(36)

  for (var property in decls) {
    var value = decls[property]
    if (typeof value === "object") {
      var nextMedia = /^@/.test(property) ? property : null
      var nextChild = nextMedia ? child : child + property
      parse(value, nextChild, nextMedia, className)
    }
  }

  insert(createRule(className + child, decls, media))
  return className
}

export default function (h) {
  return function (tag) {
    return function (decls) {
      return function (data, children) {
        data = data || {}
        data.class = parse(decls)
        return h(tag, data, children)
      }
    }
  }
}
