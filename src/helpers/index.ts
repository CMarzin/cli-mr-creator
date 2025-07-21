/* @ts-expect-error nodegit is not typed */
import nodegit from 'nodegit'

import { exec } from 'child_process'
import util from 'util'

const execProcess = util.promisify(exec)
const URISlash = '%2F'

/**
 * Types
 */

import type { ItemOptionType } from '../types/global.js'

/**
 * Check if the environment variable is set
 *
 * @param value - The value to check
 * @param varEnv - The environment variable to check
 * @returns True if the environment variable is set, throw an error otherwise
 * @example
 *  isEnvVarSet(process.env['HOSTNAME'], 'HOSTNAME')
 *  // returns true or throw an error
 */
function isEnvVarSet(
  value: unknown,
  varEnv: 'HOSTNAME' | 'TOKEN' | 'DEV_GROUP',
) {
  if (!value || value === '') {
    throw new Error(
      `Veuillez renseigner la variable ${varEnv} dans le fichier ~/cli-mr-creator/.env`,
    )
  }
  return true
}

/**
 * Check if the api environment variables are set
 *
 * @returns The base url and the token or throw an error
 * @example
 *  const { baseUrl, token } = checkApiEnv()
 *  console.log(baseUrl)
 *  // returns "https://gitlab.com"
 *  console.log(token)
 *  // returns "your-token"
 */
function checkApiEnv() {
  let baseUrl = ''
  let token = ''

  if (isEnvVarSet(process.env['HOSTNAME'], 'HOSTNAME'))
    baseUrl = process.env['HOSTNAME'] as string
  if (isEnvVarSet(process.env['TOKEN'], 'TOKEN'))
    token = process.env['TOKEN'] as string

  return {
    baseUrl,
    token,
  }
}

/**
 * Get the items options
 *
 * @param items - The items to get the options from
 * @returns The items options
 */
function getItemsOptions(
  items: { name: string; id: string }[],
): ItemOptionType[] {
  return items.map((item) => ({
    name: item.name,
    value: item.id,
  }))
}

/**
 * Get the current branch name
 *
 * @returns The current branch name trimmed
 * @example
 *  const branchName = await getCurrentBranchName()
 *  console.log(branchName)
 *  // returns "main" or "feature/my-feature"
 */
async function getCurrentBranchName() {
  try {
    const { stdout } = await execProcess('git rev-parse --abbrev-ref HEAD')
    return stdout.trim()
  } catch (e) {
    console.error(e) // should contain code (exit code) and signal (that caused the termination).
  }
}

/**
 * Get the remote url
 *
 * @param gitPath - The path to the git repository
 * @param remoteName - The name of the remote
 * @returns The remote url
 * @example
 *  const remoteUrl = await getRemoteUrl(gitPath, remoteName)
 *  console.log(remoteUrl)
 *  // returns git@gitlab.com:group/subgroup/your-project.git
 */
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
 * @description This function handles the case where the domain has a subgroup
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
  getRemoteUrl,
  getScopedApiUrl,
  isEnvVarSet,
  checkApiEnv,
}
