import {
  checkApiEnv,
  getItemsOptions,
  isEnvVarSet,
} from '../src/helpers/index.js'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('getItemsOptions', () => {
  it('should return the correct options', () => {
    expect(getItemsOptions([{ name: 'test', id: '123' }])).toEqual([
      { name: 'test', value: '123' },
    ])
  })
})

describe('checkApiEnv', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should return the correct env variables when they are set', () => {
    process.env.HOSTNAME = 'https://gitlab.example.com'
    process.env.TOKEN = 'glpat-xxxxxxxxxxxxxxxxxxxx'

    expect(checkApiEnv()).toEqual({
      baseUrl: 'https://gitlab.example.com',
      token: 'glpat-xxxxxxxxxxxxxxxxxxxx',
    })
  })

  it('should throw error when HOSTNAME is missing', () => {
    delete process.env.HOSTNAME
    process.env.TOKEN = 'test-token'

    expect(() => checkApiEnv()).toThrow(
      'Veuillez renseigner la variable HOSTNAME dans le fichier ~/cli-mr-creator/.env',
    )
  })

  it('should throw error when TOKEN is missing', () => {
    process.env.HOSTNAME = 'https://gitlab.example.com'
    delete process.env.TOKEN

    expect(() => checkApiEnv()).toThrow(
      'Veuillez renseigner la variable TOKEN dans le fichier ~/cli-mr-creator/.env',
    )
  })

  it('should throw error when both variables are missing', () => {
    delete process.env.HOSTNAME
    delete process.env.TOKEN

    expect(() => checkApiEnv()).toThrow(
      'Veuillez renseigner la variable HOSTNAME dans le fichier ~/cli-mr-creator/.env',
    )
  })
})

describe('isEnvVarSet', () => {
  it('should return true when value is set', () => {
    expect(isEnvVarSet('test-value', 'TOKEN')).toBe(true)
  })

  it('should throw error when value is undefined', () => {
    expect(() => isEnvVarSet(undefined, 'TOKEN')).toThrow(
      'Veuillez renseigner la variable TOKEN dans le fichier ~/cli-mr-creator/.env',
    )
  })

  it('should throw error when value is empty string', () => {
    expect(() => isEnvVarSet('', 'TOKEN')).toThrow(
      'Veuillez renseigner la variable TOKEN dans le fichier ~/cli-mr-creator/.env',
    )
  })
})
