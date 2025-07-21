import { client } from './api-client.js'
/**
 * Helpers
 */
import {
  getScopedApiUrl,
  getItemsOptions,
  isEnvVarSet,
} from './helpers/index.js'
async function getProjectId() {
  const { scopedApiUrl } = await getScopedApiUrl()
  const projectId = await client(`projects/${scopedApiUrl}`, {
    method: 'get',
  })
  return projectId.data.id
}
function getProjectUrl(projectName) {
  return `projects/${projectName}`
}
function getGroupsMembersUrl(group) {
  return `groups/${group}/members?per_page=100`
}
function getMergeRequestUrl(id) {
  return `projects/${id}/merge_requests`
}
function getLabelUrl(id) {
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
}) {
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
async function postMergeRequest(id, data) {
  try {
    const params = buildMergeRequestParams(data)
    const mr = await client(`${getMergeRequestUrl(id)}?${params}`, {
      method: 'post',
    })
    return mr
  } catch (error) {
    console.log('createMergeRequest error', error)
    process.exit(1)
  }
}
async function getRemoteProjectId(scopedApiUrl) {
  try {
    const project = await client(getProjectUrl(scopedApiUrl))
    return project.data.id
  } catch (error) {
    console.log('getRemoteProjectId error', error)
    process.exit(1)
  }
}
async function getProjectLabelsById(id) {
  try {
    const response = await client(getLabelUrl(id))
    return getItemsOptions(response.data)
  } catch (error) {
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
//# sourceMappingURL=api.js.map
