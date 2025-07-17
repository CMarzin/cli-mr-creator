# Little script for creating a merge request from your CLI !

![Little script for creating a merge request from your CLI](./cli-mr-creator.gif)

## Node version used 20.15.1

## Config

Create an .env file at the root of your home directory

```sh
cd ~ && mkdir cli-mr-creator && cd cli-mr-creator && touch .env
```

__Env file content__

| Key | Description | Required | Default value |
| ----------- | ----------- | ----------- | ----------- |
| TOKEN |  Gitlab access token | yes | none |
| DEV_GROUP | Gitlab organisation | yes | none |
| API_URL | Gitlab url | yes | none |
| TARGET_BRANCH | name of the target branch | no | master |
| REMOVE_SOURCE_BRANCH | boolean | no | false |
| SQUASH | boolean | no | false |

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

# TODO
- Open source the code
- Refactor call api in order
- Système de module afin de rajouter des extensions pour les logiciels de ticketings ( Jira etc...)
- Traduction : FR / EN