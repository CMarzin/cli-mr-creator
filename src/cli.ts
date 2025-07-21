#!/usr/bin/env node

import os from 'os'

import * as dotenv from 'dotenv'

import path from 'path'

import { fileURLToPath } from 'url'

import enquirer from 'enquirer'

import colors from 'colors'

import { getCurrentBranchName } from './helpers/index.js'

import {
  assigneeFormConfig,
  baseFormConfig,
  labelsFormConfig,
  reviewersFormConfig,
  type FormConfigResultType,
} from './prompt.js'

import {
  getProjectId,
  postMergeRequest,
  getProjectLabelsById,
  getMembers,
} from './api.js'

const homedir = os.homedir()

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

let config =
  process.env.NODE_ENV === 'dev'
    ? { path: path.join(__dirname, '../.env') }
    : { path: homedir + '/cli-mr-creator/.env' }

dotenv.config(config)

const { Form, Select, MultiSelect } = enquirer as any

async function createMergeRequest(
  projectId: string,
  options: FormConfigResultType,
) {
  const { dataFromPrompt, assignee, reviewers, labels } = options

  try {
    const sourceBranch = await getCurrentBranchName()

    if (!sourceBranch) throw new Error("didn't find sourceBranch")

    const response = await postMergeRequest(projectId, {
      sourceBranch,
      targetBranch: dataFromPrompt.targetBranch,
      title: dataFromPrompt.title,
      description: dataFromPrompt.description,
      removeSourceBranch: dataFromPrompt.removeSourceBranch,
      squash: dataFromPrompt.squash,
      assigneeId: assignee,
      reviewersId: reviewers,
      labels,
    })

    if (response.status === 201) {
      console.log(
        `Congratulations your created the Merge Request : ${colors.green(response.data.title)}`,
      )
      console.log(`Available here : ${colors.green(response.data.web_url)}`)
    }
  } catch (error: any) {
    if (error.response?.status == 401) {
      console.log(
        'Création non autorisée, la merge request existe déjà : ',
        colors.red(error.response.statusText),
        error.response.status,
      )
    } else {
      console.log('URL : ', colors.cyan(error.response?.config?.url))
      console.log(
        'Something went wrong : ',
        colors.red(error.response?.statusText),
        error.response?.status,
      )
      console.log('Error message : ', colors.red(error.response?.data))
    }
  }
}

/*
 * Execute prompt
 */

async function executePrompts() {
  const projectId = await getProjectId()

  try {
    const branchName = await getCurrentBranchName()

    if (!branchName) throw new Error("didn't find branchName")

    const promptForm = new Form(baseFormConfig(branchName))

    const formResult = await promptForm.run()

    const groupMembers = await getMembers()

    if (!groupMembers || groupMembers.length === 0) {
      throw new Error('No group members found')
    }

    const promptSelectAssignees = new Select(assigneeFormConfig(groupMembers))

    const promptSelectReviewers = new MultiSelect(
      reviewersFormConfig(groupMembers),
    )

    const groupLabels = await getProjectLabelsById(projectId)

    let promptSelectLabels: any | null = null
    let labelsSelected: string = ''

    if (groupLabels && groupLabels.length > 0) {
      promptSelectLabels = new MultiSelect(labelsFormConfig(groupLabels))
    }

    const selectedAssignees = await promptSelectAssignees.run()

    const reviewersSelected = await promptSelectReviewers.run()

    if (promptSelectLabels) labelsSelected = await promptSelectLabels.run()

    createMergeRequest(projectId, {
      dataFromPrompt: formResult,
      assignee: selectedAssignees,
      reviewers: reviewersSelected,
      labels: labelsSelected,
    })
  } catch (error) {
    console.log('error', error)
  }
}

executePrompts()
