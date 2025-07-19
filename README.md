# Little script for creating a merge request from your CLI !

![Little script for creating a merge request from your CLI](./cli-mr-creator.gif)

## Node version used 20.15.1

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
| TARGET_BRANCH        | name of the target branch | no       | main          |
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

[x] Open source the code
[x] Add CI
[x] Add Typescript
[x] Add License
[ ] Add the possibility to create a pull request for Github.
[ ] Add ticketing system, ex : Jira pull the correct URL from the name of the branch
[ ] Setup an axios instance
[ ] Add correct type
[ ] Tests
[ ] Refactor call api in order
[ ] Translation : FR / EN
