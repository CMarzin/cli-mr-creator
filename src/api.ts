import { client } from './api-client.js'

/**
 * Helpers
 */

import {
  getScopedApiUrl,
  getItemsOptions,
  isEnvVarSet,
} from './helpers/index.js'

/**
 * Types
 */

type MergeRequestData = {
  sourceBranch: string
  targetBranch: string
  title: string
  description: string
  removeSourceBranch: boolean
  squash: boolean
  assigneeId: string
  reviewersId: string
  labels: string
}

async function getProjectId() {
  const { scopedApiUrl } = await getScopedApiUrl()
  const projectId = await client(`projects/${scopedApiUrl}`, {
    method: 'get',
  })
  return projectId.data.id
}

function getProjectUrl(projectName: string): `projects/${string}` {
  return `projects/${projectName}`
}

function getGroupsMembersUrl(
  group: string,
): `groups/${string}/members?per_page=100` {
  return `groups/${group}/members?per_page=100`
}

function getMergeRequestUrl(id: string): `projects/${string}/merge_requests` {
  return `projects/${id}/merge_requests`
}

function getLabelUrl(id: string): `projects/${string}/labels` {
  return `projects/${id}/labels`
}

function buildMergeRequestParams({
  sourceBranch,
  targetBranch,
  title,
  description,
  removeSourceBranch,
  squash,
  assigneeId,
  reviewersId,
  labels,
}: MergeRequestData) {
  let mergeRequestUrl = ''

  mergeRequestUrl += `source_branch=${sourceBranch}`
  mergeRequestUrl += `&target_branch=${targetBranch}`
  mergeRequestUrl += `&title=${title}`
  mergeRequestUrl += `&description=${description}`
  mergeRequestUrl += `&remove_source_branch=${removeSourceBranch}`
  mergeRequestUrl += `&squash=${squash}`
  mergeRequestUrl += `&assignee_id=${assigneeId}`
  mergeRequestUrl += `&reviewer_ids=${reviewersId}`
  mergeRequestUrl += `&labels=${labels}`

  return mergeRequestUrl
}

async function postMergeRequest(id: string, data: MergeRequestData) {
  try {
    const params = buildMergeRequestParams(data)
    const mr = await client(`${getMergeRequestUrl(id)}?${params}`, {
      method: 'post',
    })

    return mr
  } catch (error: unknown) {
    console.log('createMergeRequest error', error)
    process.exit(1)
  }
}

async function getRemoteProjectId(scopedApiUrl: string) {
  try {
    const project = await client(getProjectUrl(scopedApiUrl))
    return project.data.id
  } catch (error: unknown) {
    console.log('getRemoteProjectId error', error)
    process.exit(1)
  }
}

async function getProjectLabelsById(id: string) {
  try {
    const response = await client(getLabelUrl(id))
    return getItemsOptions(response.data)
  } catch (error: unknown) {
    console.log('getProjectLabelsById error', error)
    process.exit(1)
  }
}

async function getMembers() {
  try {
    const devGroup = process.env['DEV_GROUP']
    isEnvVarSet(devGroup, 'DEV_GROUP')

    if (!devGroup) return

    const response = await client(getGroupsMembersUrl(devGroup))

    return getItemsOptions(response.data)
  } catch (error) {
    console.log('error', error)
  }
}

export type { MergeRequestData }

export {
  getProjectId,
  getProjectLabelsById,
  getRemoteProjectId,
  getProjectUrl,
  getGroupsMembersUrl,
  getMergeRequestUrl,
  getLabelUrl,
  postMergeRequest,
  getMembers,
  buildMergeRequestParams,
}
