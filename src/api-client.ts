/**
 * Libraries
 */

import axios from 'axios'

/**
 * Helpers
 */

import { checkApiEnv } from './helpers/index.js'

/**
 * Types
 */

import type { AxiosRequestConfig } from 'axios'

async function client(
  endPoint: string,
  { method = 'get', ...customConfig }: AxiosRequestConfig = {},
) {
  const headers: Record<string, string> = {
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
