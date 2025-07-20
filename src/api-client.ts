/**
 * Libraries
 */

import axios from 'axios'
import colors from 'colors'

/**
 * Helpers
 */

import { isEnvVarSet } from './helpers/index.js'

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
  const baseUrl = process.env['HOSTNAME']
  const token = process.env['TOKEN']

  try {
    isEnvVarSet(token, 'TOKEN')
    isEnvVarSet(baseUrl, 'HOSTNAME')

    if (token) headers['Private-token'] = token

  } catch (error) {
    console.log(colors.red('Erreur :'), error)
    process.exit(0)
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
