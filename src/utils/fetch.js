import wepy from 'wepy'
const BASE_URL_REMOTE = 'https://itjustfun.cn/api/public/v1/'
const BASE_URL_LOCALE = 'http://localhost:8888/api/public/v1/'
export default function fetch(url, options = {}) {
  if (typeof url === 'string') {
    options.url = url
  }
  if (typeof url === 'object') {
    options = url
  }

  if (options.type === 'local') {
    options.url = BASE_URL_LOCALE + options.url
  } else {
    options.url = BASE_URL_REMOTE + options.url
  }
  return wepy.request({
    url: options.url,
    method: options.method || 'GET',
    data: options.data || {},
    header: options.header || {}
  })
}
