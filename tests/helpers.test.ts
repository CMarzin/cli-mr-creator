import { getItemsOptions } from '../src/helpers/index.js'
import { describe, it, expect } from 'vitest'

describe('getItemsOptions', () => {
  it('should return the correct options', () => {
    expect(getItemsOptions([{ name: 'test', id: '123' }])).toEqual([
      { name: 'test', value: '123' },
    ])
  })
})
