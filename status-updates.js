require('dotenv').config()
const fs = require('fs')
const request = require('request')
const Promise = require('bluebird')
const octokit = require('@octokit/rest')()

// // // //

// Pull constants from env
const { SEMESTER, REPO_NAME, GITHUB_API_TOKEN } = process.env
const USERS_API_ROOT = `https://rcos.io/api/users`

// Authenticates GitHub REST client
octokit.authenticate({
  type: 'oauth',
  token: GITHUB_API_TOKEN
})

// Stores the user stats
const results = []

// Pulls list of users from Observatory
console.info('Fetching users from Observatory...')
request(USERS_API_ROOT, async (error, response, body) => {

  // Parses active RCOS users from response
  let users = JSON.parse(body)

  // Iterate over each user
  await Promise.each(users, (u) => {

    // Pulls repository info for each user
    return new Promise((resolve, reject) => {

      // Logs
      console.log('Checking user:', u.name)

      // Assembles the output for each user
      let user = {
        name: u.name,
        email: u.email,
        github: u.github.login,
        count: 0
      }

      function trackUser (user, repo_exists, semester_exists, count) {
        user.repo_exists = repo_exists
        user.semester_exists = semester_exists
        user.cout = count
        results.push(user)
      }

      // Requests the user's status updates for the SEMESTER
      octokit.repos.get({
        owner: user.github,
        repo: REPO_NAME,
        ref: 'master'
      }).then(({ data, headers, status }) => {
        // Requests the user's status updates for the SEMESTER
        octokit.repos.getContent({
          owner: user.github,
          repo: REPO_NAME,
          path: SEMESTER,
          ref: 'master'
        }).then(({ data, headers, status }) => {
          trackUser(user, true, true, data.length)
          return resolve()
        })
        .catch((err) => {
          trackUser(user, true, false, -1)
          return resolve()
        })

      })
      .catch((err) => {
        trackUser(user, false, false, -1)
        return resolve()
      })

    });
  })

  // Writes the results to a CSV
  let csv = []
  csv.push('"name", "email", "github", "repo exists", "semester exists", "updates"')
  results.forEach((r) => {
    csv.push(`"${r.name}", "${r.email}", "${r.github}", "${r.repo_exists}", "${r.semester_exists}", "${r.count}"`)
  })

  console.log('Writing results to CSV...')
  fs.writeFileSync('status-updates.csv', csv.join('\n'))

  console.log('Writing results to JSON...')
  fs.writeFileSync('status-updates.json', JSON.stringify(results, null, 2))

});
