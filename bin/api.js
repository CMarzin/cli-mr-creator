import { client } from './api-client.js'
import { getScopedApiUrl } from './helpers/index.js'
async function getProjectId() {
  const { scopedApiUrl } = await getScopedApiUrl()
  const projectId = await client(`projects/${scopedApiUrl}`, {
    method: 'get',
  })
  return projectId.data.id
}
function getMrUrlByProjectId(id) {
  return `projects/${id}/merge_requests`
}
async function postMergeRequest(id, data) {
  const mr = await client(`projects/${id}/merge_requests`, {
    method: 'post',
  })
}
async function getLabelsByProjectId(id) {
  const { scopedApiUrl } = await getScopedApiUrl()
  return `projects/${id}/labels`
}
export { getLabelsByProjectId, getMrUrlByProjectId, getProjectId }
//# sourceMappingURL=api.js.map
