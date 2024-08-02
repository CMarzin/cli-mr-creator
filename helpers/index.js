import nodegit from 'nodegit'
import axios from 'axios'
import { exec } from 'child_process'
import util from 'util'

const execProcess = util.promisify(exec)

const getCurrentBranchName = async () => {
  try {
    const { stdout } = await execProcess('git rev-parse --abbrev-ref HEAD');
    return stdout.trim()
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }

}

async function getMembers () {

  const url = `${process.env['API_URL']}/api/v4/groups/${process.env['DEV_GROUP']}/members?per_page=100`
  const headers = {
    'Private-token': process.env['TOKEN'],
  }

  try {
    const members = await axios({
      method: 'get',
      url: url,
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    let membersArray = []

    for (let i = 0; i < members.data.length; i++) {
      membersArray.push({
        name: members.data[i].name,
        value: members.data[i].id
      })
    }

    return membersArray
  } catch (error) {
    console.log('error', error)
  }
}

async function getLabels (baseUrl) {

  const url = `${baseUrl}/labels`

  const headers = {
    'Private-token': process.env['TOKEN'],
  }

  try {
    const response = await axios({
      method: 'get',
      url: url,
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    let labels = []

    for (let i = 0; i < response.data.length; i++) {
      labels.push({
        name: response.data[i].name,
        value: response.data[i].id
      })
    }

    return labels
  } catch (error) {
    console.log('error', error)
  }
}

async function getRemoteUrl (gitPath, remoteName) {
  try {
    let repository = await nodegit.Repository.open(gitPath);
    let remoteObject = await repository.getRemote(remoteName);
    let remoteUrl = await remoteObject.url();
    return remoteUrl;
  } catch (error) {
    console.log(error);
  }
};


export {
  getCurrentBranchName,
  getMembers,
  getLabels,
  getRemoteUrl
}