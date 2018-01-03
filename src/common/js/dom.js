export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let classArr = el.className.split(' ')
  classArr.push(className)
  el.className = classArr.join(' ')
}

export function hasClass (el, className) {
  const reg = new RegExp('(^|\\s)+className+(\\s|$)')
  return reg.test(el.className)
}

export function getIndex (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
