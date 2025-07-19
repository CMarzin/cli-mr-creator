import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

async function client(
  endPoint: string,
  { method = 'get', ...customConfig }: AxiosRequestConfig = {},
) {
  const headers: Record<string, string> = {
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
