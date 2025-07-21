import {
  getProjectUrl,
  getGroupsMembersUrl,
  getMergeRequestUrl,
  getLabelUrl,
  buildMergeRequestParams,
} from '../src/api.js'

import { describe, it, expect } from 'vitest'

describe('getProjectUrl', () => {
  it('should return the correct url', () => {
    expect(getProjectUrl('123')).toEqual('projects/123')
  })
})

describe('getGroupsMembersUrl', () => {
  it('should return the correct url', () => {
    expect(getGroupsMembersUrl('123')).toEqual(
      'groups/123/members?per_page=100',
    )
  })
})

describe('getMergeRequestUrl', () => {
  it('should return the correct url', () => {
    expect(getMergeRequestUrl('123')).toEqual('projects/123/merge_requests')
  })
})

describe('getLabelUrl', () => {
  it('should return the correct url', () => {
    expect(getLabelUrl('123')).toEqual('projects/123/labels')
  })
})

describe('buildMergeRequestParams', () => {
  it('should return the correct params', () => {
    expect(
      buildMergeRequestParams({
        sourceBranch: '123',
        targetBranch: '123',
        title: '123',
        description: '123',
        removeSourceBranch: true,
        squash: true,
        assigneeId: '123',
        reviewersId: '123,123',
        labels: '123,123',
      }),
    ).toEqual(
      'source_branch=123&target_branch=123&title=123&description=123&remove_source_branch=true&squash=true&assignee_id=123&reviewer_ids=123,123&labels=123,123',
    )
  })
})
