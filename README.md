# Petit script pour créer une merge request depuis le terminal !

![Petit script pour créer une merge request depuis le terminal](./cli-mr-creator.gif)

## Node version used 20.15.1

## Config

__Créer un fichier .env à la racine de votre home directory__

```sh
cd ~ && mkdir cli-mr-creator && cd cli-mr-creator && touch .env
```

__Env file__
```env
TOKEN= // Gitlab access token
DEV_GROUP= // organisation
API_URL= // example: https://gitlab.com
TARGET_BRANCH= // master/main/develop etc...
REMOVE_SOURCE_BRANCH= // boolean
SQUASH= // boolean
```

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
[] open source the code
[] Refactor call api in order
[] Système de module afin de rajouter des extensions pour les logiciels de ticketings ( Jira etc...)
[] Traduction : FR / EN