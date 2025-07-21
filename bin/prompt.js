import colors from 'colors'
const promptNames = {
  USER: 'user',
  ASSIGNEE: 'assignee',
  REVIEWERS: 'reviewers',
  LABELS: 'labels',
}
const choicesName = {
  TARGET_BRANCH: 'targetBranch',
  TITLE: 'title',
  REMOVE_SOURCE_BRANCH: 'removeSourceBranch',
  SQUASH: 'squash',
  DESCRIPTION: 'description',
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
function getDefaultChoices(branchName) {
  return {
    targetBranch: process.env['TARGET_BRANCH'] || 'master',
    title: branchName,
    removeSourceBranch: process.env['REMOVE_SOURCE_BRANCH'] || false,
    squash: process.env['SQUASH'] || false,
  }
}
function baseFormConfig(branchName) {
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
function assigneeFormConfig(groupMembers) {
  return {
    name: promptNames.ASSIGNEE,
    message: `Veuillez sélectionner un(e) développeur(euse) pour ${colors.green.underline('inspecter')} votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour sélectionner]')}`,
    choices: groupMembers,
    result(name) {
      return (
        this.choices.find((choice) => {
          if (choice.name === name) {
            return choice.value
          }
        })?.value || ''
      )
    },
  }
}
function reviewersFormConfig(groupMembers) {
  return {
    name: promptNames.REVIEWERS,
    message: `Veuillez sélectionner un(e) développeur(euse) pour ${colors.green.underline('inspecter')} votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour sélectionner]')}`,
    choices: groupMembers,
    result(reviewers) {
      // @ts-expect-error - enquirer is not typed, but this function is from the library
      const resultKeyValue = this.map(reviewers)
      let reviewersParams = ''
      for (const property in resultKeyValue) {
        reviewersParams += `${resultKeyValue[property]},`
      }
      return reviewersParams.substring(0, reviewersParams.length - 1)
    },
  }
}
function labelsFormConfig(groupLabels) {
  return {
    name: promptNames.LABELS,
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
  }
}
export {
  assigneeFormConfig,
  getDefaultChoices,
  baseFormConfig,
  reviewersFormConfig,
  labelsFormConfig,
}
//# sourceMappingURL=prompt.js.map
