import { getMrUrlByProjectId } from '../src/api.js'
import { describe, it, expect } from 'vitest'

describe('getMrUrlByProjectId', () => {
  it('should return the correct url', () => {
    expect(getMrUrlByProjectId('123')).toEqual('123/merge_requests')
  })
})
