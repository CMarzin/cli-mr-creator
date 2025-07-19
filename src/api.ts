import { client } from './api-client.js'
import { getScopedApiUrl } from './helpers/index.js'

async function getProjectId() {
  const { scopedApiUrl } = await getScopedApiUrl()
  const projectId = await client(`projects/${scopedApiUrl}`, {
    method: 'get',
  })
  return projectId.data.id
}

function getMrUrlByProjectId(id: string): `${string}/merge_requests` {
  return `${id}/merge_requests`
}

async function postMergeRequest(id: string, data: any) {
  const mr = await client(`projects/${id}/merge_requests`, {
    method: 'post',
  })
}

async function getLabelsByProjectId(id: string) {
  const { scopedApiUrl } = await getScopedApiUrl()

  return `${scopedApiUrl}/${id}/labels`
}

export { getLabelsByProjectId, getMrUrlByProjectId, getProjectId }
