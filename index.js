import core from '@actions/core';
import fetch from 'node-fetch';

async function getBadge(label, message, color) {

  let response = await fetch(`https://img.shields.io/static/v1?label=${label}&message=${message}&color=${color}`)
  if (!response.ok) {
    throw Error(response.statusText);
  }
  let data = await response.text()
  return data
}

async function updateGist(gistId, filename, badge) {

  let requestBody = {
    description: 'Update badge',
    files: {}
  }
  requestBody.files[filename] = {
    content: badge
  }

  let response = await fetch('https://api.github.com/gists/' + gistId, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': 'token ' + process.env.GITHUB_TOKEN
    },
    body: JSON.stringify(requestBody)
  })
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

async function run() {

  try {

    const label = core.getInput('label');
    const message = core.getInput('message');
    const color = core.getInput('color');
    const gistId = core.getInput('gist-id');
    const filename = core.getInput('filename')

    let badge = await getBadge(label, message, color)
    await updateGist(gistId, filename, badge)

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
