import axios from 'axios'
async function client(endPoint, { method = 'get', ...customConfig } = {}) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const baseUrl = process.env['HOSTNAME']
  const token = process.env['TOKEN']
  if (!baseUrl) {
    throw new Error('HOSTNAME is not set')
  }
  if (!token) {
    throw new Error('TOKEN is not set')
  } else {
    headers['Private-token'] = token
  }
  const config = {
    url: `${baseUrl}/api/v4/${endPoint}`,
    method,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }
  return axios(config)
}
export { client }
//# sourceMappingURL=api-client.js.map
