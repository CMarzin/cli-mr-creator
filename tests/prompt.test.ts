import { describe, it, expect } from 'vitest'
import colors from 'colors'

import {
  assigneeFormConfig,
  baseFormConfig,
  getDefaultChoices,
  labelsFormConfig,
  reviewersFormConfig,
} from '../src/prompt.js'

describe('getDefaultChoices', () => {
  it('should return the correct default choices', () => {
    expect(getDefaultChoices('main')).toEqual({
      targetBranch: 'master',
      title: 'main',
      removeSourceBranch: false,
      squash: false,
    })
  })
})

describe('baseFormConfig', () => {
  it('should return the correct base form config', () => {
    expect(baseFormConfig('main')).toEqual({
      name: 'user',
      message: `Veuillez remplir les informations suivantes pour créer votre merge request: ${colors.cyan('[tab ou flèches pour se déplacer]')}`,
      choices: [
        {
          name: 'targetBranch',
          message: 'Spécifiez la branche cible',
          initial: 'master',
        },
        {
          name: 'title',
          message: 'Entrez le nom de la merge request',
          initial: 'main',
        },
        {
          name: 'description',
          message: 'Entrez votre description',
          initial: '',
        },
        {
          name: 'removeSourceBranch',
          message: 'Supprimer la branche après le merge',
          initial: false,
        },
        {
          name: 'squash',
          message: 'Squash les commits',
          initial: false,
        },
      ],
    })
  })
})

describe('assigneeFormConfig', () => {
  it('should return the correct assignee form config', () => {
    expect(
      assigneeFormConfig([
        { name: 'jean', value: '123' },
        { name: 'paul', value: '13' },
      ]),
    ).toEqual({
      name: 'assignee',
      message: `Veuillez sélectionner un(e) développeur(euse) pour ${colors.green.underline('inspecter')} votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour sélectionner]')}`,
      choices: [
        {
          name: 'jean',
          value: '123',
        },
        {
          name: 'paul',
          value: '13',
        },
      ],
      result: expect.any(Function),
    })
  })
})

describe('reviewersFormConfig', () => {
  it('should return the correct reviewers form config', () => {
    expect(
      reviewersFormConfig([
        { name: 'jean', value: '123' },
        { name: 'paul', value: '13' },
      ]),
    ).toEqual({
      name: 'reviewers',
      message: `Veuillez sélectionner un(e) développeur(euse) pour ${colors.green.underline('inspecter')} votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour sélectionner]')}`,
      choices: [
        {
          name: 'jean',
          value: '123',
        },
        {
          name: 'paul',
          value: '13',
        },
      ],
      result: expect.any(Function),
    })
  })
})

describe('labelsFormConfig', () => {
  it('should return the correct labels form config', () => {
    expect(
      labelsFormConfig([
        { name: 'jean', value: '123' },
        { name: 'paul', value: '13' },
      ]),
    ).toEqual({
      name: 'labels',
      message: `Veuillez sélectionner les ${colors.green.underline('labels')} correspondants à votre merge request : ${colors.cyan('[tab ou flèches pour se déplacer, espace pour sélectionner]')}`,
      choices: [
        {
          name: 'jean',
          value: '123',
        },
        {
          name: 'paul',
          value: '13',
        },
      ],
      result: expect.any(Function),
    })
  })
})
