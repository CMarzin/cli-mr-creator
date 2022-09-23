#!/usr/bin/env node

import os from 'os'

const homedir = os.homedir()

import * as dotenv from 'dotenv'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

let config = process.env.NODE_ENV === 'dev' ? {path: __dirname + '/.env'} : {path: homedir + '/cli-mr-creator/.env'}

dotenv.config(config)

import axios from 'axios'

import enquirer from 'enquirer'

const { Form, Select } = enquirer

import colors from 'colors'

import {
  getCurrentBranchName,
  buildRefTicketRedmine,
  getAssignee,
  getRemoteUrl
} from './helpers/index.js'

let token = ''
let redmineUrl = ''

/*
* Check token and redmine url
*/

try {

  token = process.env['TOKEN']

  if (token === void 0 || token === '') {
    throw "Veuillez spécifier le token pour accéder à l'api Gitlab dans un fichier ENV"
  }

  redmineUrl = process.env['REDMINE_URL']

} catch (error) {
  console.log(colors.red('Erreur :'), error)
  process.exit(0);
}

let currentRedmineRefTicket = ''

// disable redmine ticket for now
// refactor this part to create some extend function later
if (redmineUrl !== void 0 || redmineUrl !== '') {
  // currentRedmineRefTicket = buildRefTicketRedmine(redmineUrl, currentBranchName)
}

async function createMergeRequest (dataFromPrompt, mrAssignee) {

  try {

    const regex = /([^\/]*$)/gm;
    const currentProjectName = process.cwd().match(regex);

    const gitPath = process.cwd() + '/.git'
    const remoteName = 'origin'

    const remoteUrl = await getRemoteUrl(gitPath, remoteName)

    const regexOrg = /(?<=\:)(.*?)(?=\/)/;
    const org = remoteUrl.match(regexOrg)

    const regexApiUrl = /(?<=\@)(.*?)(?=\:)/;
    const api_url = remoteUrl.match(regexApiUrl)

    const baseUrl = `https://${api_url[0]}/api/v4/projects`

    const currentUrlProject = `${baseUrl}/${org[0]}%2F${currentProjectName[0]}`

    const headers = {
      'Private-token': token,
    }

    const project = await axios({
      method: 'get',
      url: currentUrlProject,
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    let mergeRequestUrl = `${baseUrl}/${project.data.id}/merge_requests`
    const sourceBranch = await getCurrentBranchName()

    mergeRequestUrl += `?source_branch=${sourceBranch}`
    mergeRequestUrl += `&target_branch=${dataFromPrompt.target_branch}`
    mergeRequestUrl += `&title=${dataFromPrompt.title}`
    mergeRequestUrl += `&description=${dataFromPrompt.description}`
    mergeRequestUrl += `&remove_source_branch=${dataFromPrompt.remove_source_branch}`
    mergeRequestUrl += `&squash=${dataFromPrompt.squash}`
    mergeRequestUrl += `&assignee_id=${mrAssignee}`

    const response = await axios({
      method: 'post',
      url: mergeRequestUrl,
      headers
    })

    if (response.status === 201) {
      console.log(`Congratulations your created the Merge Request : ${colors.green(response.data.title)}`)
      console.log(`Available here : ${colors.green(response.data.web_url)}`)
    }

  } catch (error) {

    if (error.response.status == 401) {
      console.log('Création non autorisée, la merge request existe déjà : ', colors.red(error.response.statusText), error.response.status)
    } else {
      console.log('URL : ', colors.cyan(error.response.config.url))
      console.log('Something went wrong : ', colors.red(error.response.statusText), error.response.status)
      console.log('Error message : ', colors.red(error.response.data))
    }
  }
}

/*
* Execute prompt
*/

async function executePrompts () {

/*
* Config prompt
*/

  const defaultChoices = {
    target_branch: 'master',
    title: await getCurrentBranchName(),
    description: currentRedmineRefTicket,
    remove_source_branch: 'false',
    squash: 'false'
  }

  const promptForm = new Form({
    name: 'user',
    message: `Veuillez remplir les informations suivantes pour créer votre merge request: ${colors.cyan('[tab ou flèches pour se déplacer]')}`,
    choices: [
      { name: 'target_branch', message: 'Spécifiez la branche cible', initial: defaultChoices.target_branch },
      { name: 'title', message: 'Entrez le nom de la merge request', initial: defaultChoices.title },
      { name: 'description', message: 'Entrez votre description', initial: defaultChoices.description },
      { name: 'remove_source_branch', message: 'Supprimer la branche après le merge', initial: defaultChoices.remove_source_branch },
      { name: 'squash', message: 'Squash commit', initial: defaultChoices.squash }
    ]
  });

  try {

    const formResult = await promptForm.run()
    const assignee = await getAssignee()

    const promptSelect = new Select({
      name: 'assignee',
      message: `Veuillez séléctionner un(e) développeur(euse) pour revoir votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour séléctionner]')}`,
      choices: assignee,
      result(name) {

        const valueAssignee = this.choices.find(choice => {
          if (choice.name === name) {
            return choice.value
          }
        })

        return valueAssignee.value
       }
    });

    const mrAssignee = await promptSelect.run()

    createMergeRequest(formResult, mrAssignee)

  } catch (error) {
    console.log('error', error)
  }
}

executePrompts()

