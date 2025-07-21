import colors from 'colors'

/**
 * Types
 */

import type { ValueOf } from './types/helpers.js'
import type { ItemOptionType } from './types/global.js'

const promptNames = {
  USER: 'user',
  ASSIGNEE: 'assignee',
  REVIEWERS: 'reviewers',
  LABELS: 'labels',
} as const

const choicesName = {
  TARGET_BRANCH: 'targetBranch',
  TITLE: 'title',
  REMOVE_SOURCE_BRANCH: 'removeSourceBranch',
  SQUASH: 'squash',
  DESCRIPTION: 'description',
} as const

interface BaseFormConfigChoicesType {
  name: ValueOf<typeof choicesName>
  message: string
  initial: string | boolean
}

interface BaseFormConfigType<T> {
  name: ValueOf<typeof promptNames>
  message: string
  choices: T[]
}

interface AssigneeFormConfigType extends BaseFormConfigType<ItemOptionType> {
  result: (name: string) => string
}

interface ReviewersFormConfigType extends BaseFormConfigType<ItemOptionType> {
  result: (reviewers: string[]) => string | `${string},`
}

interface LabelsFormConfigType extends BaseFormConfigType<ItemOptionType> {
  result: (labels: string[]) => string | `${string},`
}

interface FormConfigResultType {
  dataFromPrompt: {
    targetBranch: string
    title: string
    removeSourceBranch: boolean
    squash: boolean
    description: string
  }
  assignee: string
  reviewers: string
  labels: string
}

/**
 * Get the default choices
 *
 * @param branchName - The branch name
 * @returns {Object} - The default choices
 * @example
 *  const defaultChoices = getDefaultChoices('main')
 *  console.log(defaultChoices)
 *  // returns { targetBranch: 'master', title: 'main', removeSourceBranch: false, squash: false }
 */
function getDefaultChoices(branchName: string) {
  return {
    targetBranch: process.env['TARGET_BRANCH'] || 'master',
    title: branchName,
    removeSourceBranch: process.env['REMOVE_SOURCE_BRANCH'] || false,
    squash: process.env['SQUASH'] || false,
  }
}

function baseFormConfig(
  branchName: string,
): BaseFormConfigType<BaseFormConfigChoicesType> {
  const { targetBranch, title, removeSourceBranch, squash } =
    getDefaultChoices(branchName)

  return {
    name: promptNames.USER,
    message: `Veuillez remplir les informations suivantes pour créer votre merge request: ${colors.cyan('[tab ou flèches pour se déplacer]')}`,
    choices: [
      {
        name: choicesName.TARGET_BRANCH,
        message: 'Spécifiez la branche cible',
        initial: targetBranch,
      },
      {
        name: choicesName.TITLE,
        message: 'Entrez le nom de la merge request',
        initial: title,
      },
      {
        name: choicesName.DESCRIPTION,
        message: 'Entrez votre description',
        initial: '',
      },
      {
        name: choicesName.REMOVE_SOURCE_BRANCH,
        message: 'Supprimer la branche après le merge',
        initial: removeSourceBranch,
      },
      {
        name: choicesName.SQUASH,
        message: 'Squash les commits',
        initial: squash,
      },
    ],
  }
}

function assigneeFormConfig(
  groupMembers: ItemOptionType[],
): AssigneeFormConfigType {
  return {
    name: promptNames.ASSIGNEE,
    message: `Veuillez sélectionner un(e) développeur(euse) pour ${colors.green.underline('inspecter')} votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour sélectionner]')}`,
    choices: groupMembers,
    result(name: string) {
      return (
        this.choices.find((choice: ItemOptionType) => {
          if (choice.name === name) {
            return choice.value
          }
        })?.value || ''
      )
    },
  }
}

function reviewersFormConfig(
  groupMembers: ItemOptionType[],
): ReviewersFormConfigType {
  return {
    name: promptNames.REVIEWERS,
    message: `Veuillez sélectionner un(e) développeur(euse) pour ${colors.green.underline('inspecter')} votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour sélectionner]')}`,
    choices: groupMembers,
    result(reviewers: string[]) {
      // @ts-expect-error - enquirer is not typed, but this function is from the library
      const resultKeyValue: { [key: string]: number } = this.map(reviewers)

      let reviewersParams = ''

      for (const property in resultKeyValue) {
        reviewersParams += `${resultKeyValue[property]},`
      }

      return reviewersParams.substring(0, reviewersParams.length - 1)
    },
  }
}

function labelsFormConfig(groupLabels: ItemOptionType[]): LabelsFormConfigType {
  return {
    name: promptNames.LABELS,
    message: `Veuillez sélectionner les ${colors.green.underline('labels')} correspondants à votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour sélectionner]')}`,
    choices: groupLabels,
    result(labels: string[]) {
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
  }
}

export type { FormConfigResultType }

export {
  assigneeFormConfig,
  getDefaultChoices,
  baseFormConfig,
  reviewersFormConfig,
  labelsFormConfig,
}
