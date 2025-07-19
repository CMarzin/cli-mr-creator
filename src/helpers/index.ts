/* @ts-expect-error nodegit is not typed */
import nodegit from 'nodegit'

import { exec } from 'child_process'
import util from 'util'

import { getLabelsByProjectId } from '../api.js'
import { client } from '../api-client.js'

const execProcess = util.promisify(exec)
const URISlash = '%2F'

function getItemsOptions(items: { name: string; id: string }[]) {
  return items.map((item) => ({
    name: item.name,
    value: item.id,
  }))
}

async function getCurrentBranchName() {
  try {
    const { stdout } = await execProcess('git rev-parse --abbrev-ref HEAD')
    return stdout.trim()
  } catch (e) {
    console.error(e) // should contain code (exit code) and signal (that caused the termination).
  }
}

async function getMembers() {
  try {
    const members = await client(
      `groups/${process.env['DEV_GROUP']}/members?per_page=100`,
    )

    return getItemsOptions(members.data)
  } catch (error) {
    console.log('error', error)
  }
}

async function getLabels(id: string) {
  const url = await getLabelsByProjectId(id)

  try {
    const response = await client(url)

    return getItemsOptions(response.data)
  } catch (error) {
    console.log('error', error)
  }
}

async function getRemoteUrl(gitPath: string, remoteName: string) {
  try {
    let repository = await nodegit.Repository.open(gitPath)
    let remoteObject = await repository.getRemote(remoteName)
    let remoteUrl = await remoteObject.url()
    return remoteUrl
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get the scoped api url
 *
 * @description This function is used in case the domain has a subgroup
 *
 * @returns {Promise<{scopedApiUrl: string, remoteUrlApi: string}>} - The scoped api url and the remote url api
 *
 * @example
 *  const { scopedApiUrl, remoteUrlApi } = await getScopedApiUrl()
 *  console.log(scopedApiUrl)
 *  // returns "my-org/my-project"
 *  console.log(remoteUrlApi)
 *  // returns "https://gitlab.com"
 */
async function getScopedApiUrl() {
  const gitPath = process.cwd() + '/.git'
  const remoteName = 'origin'

  const remoteUrl = await getRemoteUrl(gitPath, remoteName)

  const regex = /[^:]+:(?:[^\/]+\/)?([^\.]+)\.git/

  let currentProjectName = remoteUrl.match(regex)[1]

  if (currentProjectName.includes('/')) {
    currentProjectName = currentProjectName.replace('/', URISlash)
  }

  const regexOrg = /(?<=\:)(.*?)(?=\/)/
  const org = remoteUrl.match(regexOrg)

  const regexApiUrl = /(?<=\@)(.*?)(?=\:)/
  const remoteUrlApi = remoteUrl.match(regexApiUrl)[0]

  const scopedApiUrl = `${org[0]}${URISlash}${currentProjectName}`

  return {
    remoteUrlApi,
    scopedApiUrl,
  }
}

export {
  getItemsOptions,
  getCurrentBranchName,
  getMembers,
  getLabels,
  getRemoteUrl,
  getScopedApiUrl,
}
