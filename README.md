# Create a merge request in less than 20 seconds

This package is because I love the terminal, spent too much time in it and I wanted to create a merge request after my last commit.

The trigger for this package is because, I wanted to know the time I took to create a merge request from the Gitlab UI ( more than 1 minutes, to find the repo/create the MR).

## Before the creation of my script

| Seconds | Merges requests | By week | Calcul      | Result                                |
| ------- | --------------- | --------| ----------- | --------------------------------------|
| 60      |  10             | 5       | 60 * 10 * 5 | 3000 secondes or 50 minutes by month  |

## After the creation of my script

| Seconds | Merges requests | By week | Calcul      | Result                             |
| ------- | --------------- | --------| ----------- | -----------------------------------|
| 20      |  10             | 5       | 20 * 10 * 5 | 1000 secondes or 16min40 by month  |

**DISCLAIMER** This script is mainly for my use case, you are free to open a PR or fork the project to adapt the code for you.

Enjoy !

![Gif demo of the script for creating a merge request from your CLI](./cli-mr-creator.gif)

## Node version used 20.17.0

## Config

Create an .env file at the root of your home directory

```sh
cd ~ && mkdir cli-mr-creator && cd cli-mr-creator && touch .env
```

**Env file content**

| Key                  | Description               | Required | Default value |
| -------------------- | ------------------------- | -------- | ------------- |
| TOKEN                | Gitlab access token       | yes      | none          |
| DEV_GROUP            | Gitlab organisation       | yes      | none          |
| HOSTNAME             | Gitlab host name          | yes      | gitlab.com    |
| TARGET_BRANCH        | name of the target branch | no       | master        |
| REMOVE_SOURCE_BRANCH | boolean                   | no       | false         |
| SQUASH               | boolean                   | no       | false         |

## Use the script

```sh
# Local installation
npm i cli-mr-creator

# Global installation
npm i -g cli-mr-creator

# and you can summon the command in your cli
cli-mr-creator

# Or you can launch it with npx
npx cli-mr-creator
```

# Roadmap

- [x] Open source the code
- [x] Add CI
- [x] Add Typescript
- [x] Add License
- [ ] Add the possibility to create a pull request for Github.
- [ ] Add ticketing system, ex : Jira pull the correct URL from the name of the branch
- [ ] Setup an axios instance
- [x] Add correct type
- [x] Tests
- [x] Refactor call api in order
- [ ] Translation : FR / EN
