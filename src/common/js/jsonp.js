import originalJsonp from 'jsonp'

export default function jsonp (url, data, options) {
  url += (url.indexOf('?') > -1 ? '&' : '?') + param(data)
  return new Promise((resolve, reject) => {
    originalJsonp(url, options, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (let k = 0; k < data.length; k++) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }

  return url ? url.slice(1) : ''
}
