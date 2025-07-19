#!/usr/bin/env node
import os from 'os'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import enquirer from 'enquirer'
import colors from 'colors'
import { client } from './api-client.js'
import { getCurrentBranchName, getMembers, getLabels } from './helpers/index.js'
import { getMrUrlByProjectId, getProjectId } from './api.js'
const homedir = os.homedir()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
let config =
  process.env.NODE_ENV === 'dev'
    ? { path: path.join(__dirname, '../.env') }
    : { path: homedir + '/cli-mr-creator/.env' }
dotenv.config(config)
const { Form, Select, MultiSelect } = enquirer
let token = ''
/*
 * Check token
 */
try {
  token = process.env['TOKEN']
  if (token === void 0 || token === '') {
    throw "Veuillez spécifier le token pour accéder à l'api Gitlab dans un fichier ENV"
  }
} catch (error) {
  console.log(colors.red('Erreur :'), error)
  process.exit(0)
}
async function createMergeRequest(url, options) {
  const { dataFromPrompt, assignees, reviewers, labels } = options
  try {
    let mergeRequestUrl = url
    const sourceBranch = await getCurrentBranchName()
    mergeRequestUrl += `?source_branch=${sourceBranch}`
    mergeRequestUrl += `&target_branch=${dataFromPrompt.target_branch}`
    mergeRequestUrl += `&title=${dataFromPrompt.title}`
    mergeRequestUrl += `&description=${dataFromPrompt.description}`
    mergeRequestUrl += `&remove_source_branch=${dataFromPrompt.remove_source_branch}`
    mergeRequestUrl += `&squash=${dataFromPrompt.squash}`
    mergeRequestUrl += `&assignee_id=${assignees}`
    mergeRequestUrl += `&reviewer_ids=${reviewers}`
    if (labels && labels.length > 0) {
      mergeRequestUrl += `&labels=${labels}`
    }
    const response = await client(mergeRequestUrl, {
      method: 'post',
    })
    if (response.status === 201) {
      console.log(
        `Congratulations your created the Merge Request : ${colors.green(response.data.title)}`,
      )
      console.log(`Available here : ${colors.green(response.data.web_url)}`)
    }
  } catch (error) {
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
  const mrUrl = await getMrUrlByProjectId(projectId)
  /*
   * Config prompt
   */
  const defaultChoices = {
    target_branch: process.env['TARGET_BRANCH'] || 'master',
    title: await getCurrentBranchName(),
    remove_source_branch: process.env['REMOVE_SOURCE_BRANCH'] || false,
    squash: process.env['SQUASH'] || false,
    description: '',
  }
  const promptForm = new Form({
    name: 'user',
    message: `Veuillez remplir les informations suivantes pour créer votre merge request: ${colors.cyan('[tab ou flèches pour se déplacer]')}`,
    choices: [
      {
        name: 'target_branch',
        message: 'Spécifiez la branche cible',
        initial: defaultChoices.target_branch,
      },
      {
        name: 'title',
        message: 'Entrez le nom de la merge request',
        initial: defaultChoices.title,
      },
      {
        name: 'description',
        message: 'Entrez votre description',
        initial: defaultChoices.description,
      },
      {
        name: 'remove_source_branch',
        message: 'Supprimer la branche après le merge',
        initial: defaultChoices.remove_source_branch,
      },
      {
        name: 'squash',
        message: 'Squash commit',
        initial: defaultChoices.squash,
      },
    ],
  })
  try {
    const formResult = await promptForm.run()
    const groupMembers = await getMembers()
    const promptSelectAssignees = new Select({
      name: 'assignee',
      message: `Veuillez sélectionner le/la développeur(euse) désigner comme le/la ${colors.green.underline('créateur(trice)')} de la merge request : ${colors.cyan('[tab ou flèches pour se déplacer]')}`,
      choices: groupMembers,
      result(name) {
        const valueAssignee = this.choices.find((choice) => {
          if (choice.name === name) {
            return choice.value
          }
        })
        return valueAssignee.value
      },
    })
    const promptSelectReviewers = new MultiSelect({
      name: 'reviewers',
      message: `Veuillez sélectionner un(e) développeur(euse) pour ${colors.green.underline('inspecter')} votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour sélectionner]')}`,
      choices: groupMembers,
      result(reviewers) {
        const resultKeyValue = this.map(reviewers)
        let reviewersParams = ''
        for (const property in resultKeyValue) {
          reviewersParams += `${resultKeyValue[property]},`
        }
        return reviewersParams.substring(0, reviewersParams.length - 1)
      },
    })
    const groupLabels = await getLabels(projectId)
    let promptSelectLabels = null
    let labelsSelected = []
    if (groupLabels && groupLabels.length > 0) {
      promptSelectLabels = new MultiSelect({
        name: 'labels',
        message: `Veuillez sélectionner les ${colors.green.underline('labels')} correspondants à votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour sélectionner]')}`,
        choices: groupLabels,
        result(labels) {
          let labelsParams = ''
          for (let i = 0; i < labels.length; i++) {
            if (i !== labels.length - 1) {
              labelsParams += `${labels[i]},`
            } else {
              labelsParams += labels[i]
            }
          }
          return labelsParams
        },
      })
    }
    const selectedAssignees = await promptSelectAssignees.run()
    const reviewersSelected = await promptSelectReviewers.run()
    if (promptSelectLabels) {
      labelsSelected = await promptSelectLabels.run()
    }
    // console.log('mrUrl', mrUrl)
    // console.log('formResult', formResult)
    // console.log('selectedAssignees', selectedAssignees)
    // console.log('reviewersSelected', reviewersSelected)
    // console.log('labelsSelected', labelsSelected)
    // process.exit(0)
    createMergeRequest(mrUrl, {
      dataFromPrompt: formResult,
      assignees: selectedAssignees,
      reviewers: reviewersSelected,
      labels: labelsSelected,
    })
  } catch (error) {
    console.log('error', error)
  }
}
executePrompts()
//# sourceMappingURL=cli.js.map
