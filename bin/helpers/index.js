import nodegit from 'nodegit';
import axios from 'axios';
import { exec } from 'child_process';
import util from 'util';
const execProcess = util.promisify(exec);
const getCurrentBranchName = async () => {
  try {
    const {
      stdout
    } = await execProcess('git rev-parse --abbrev-ref HEAD');
    return stdout.trim();
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
};

function buildRefTicketRedmine(redmineUrl, currentBranchName) {
  // Get the last five character of the string which are the ID of the ticket
  let getTicketId = currentBranchName.slice(currentBranchName.length - 5);
  if (isNaN(getTicketId)) {
    return '';
  } else {
    return `${redmineUrl}/issues/${getTicketId}`;
  }
}
async function getAssignee() {
  const url = `${process.env['API_URL']}/api/v4/groups/${process.env['DEV_GROUP']}/members?per_page=100`;
  const headers = {
    'Private-token': process.env['TOKEN']
  };
  try {
    const assignee = await axios({
      method: 'get',
      url: url,
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    let assigneeArray = [];
    for (let i = 0; i < assignee.data.length; i++) {
      assigneeArray.push({
        name: assignee.data[i].name,
        value: assignee.data[i].id
      });
    }
    return assigneeArray;
  } catch (error) {
    console.log('error', error);
  }
}
async function getRemoteUrl(gitPath, remoteName) {
  try {
    let repository = await nodegit.Repository.open(gitPath);
    let remoteObject = await repository.getRemote(remoteName);
    let remoteUrl = await remoteObject.url();
    return remoteUrl;
  } catch (error) {
    console.log(error);
  }
}
;
export { getCurrentBranchName, buildRefTicketRedmine, getAssignee, getRemoteUrl };