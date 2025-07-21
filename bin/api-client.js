/**
 * Libraries
 */
import axios from 'axios'
/**
 * Helpers
 */
import { checkApiEnv } from './helpers/index.js'
async function client(endPoint, { method = 'get', ...customConfig } = {}) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const { token, baseUrl } = checkApiEnv()
  headers['Private-token'] = token
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
