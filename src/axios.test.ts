import { getHeaders } from './axios.js'
import { describe, it, expect } from 'vitest'

describe('getHeaders', () => {
  it('should return the correct headers', () => {
    expect(getHeaders()).toEqual({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
  })
})