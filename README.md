# RCOS Stats

Automatically generates statistics using Observatory3 and Github

## Setup
Run `npm install` to install all dependencies.

You will also need to create a `.env` file to store environment variables. Copy the `.env.example` file and use that as a starting point.

Lastly you will need to create a [GitHub Personal Access Token](https://github.com/settings/tokens) and add it to the `.env` file as `GITHUB_API_TOKEN`.

## Status Update Stats

To generate stats for [rcos-status-updates](https://handbook.rcos.io/#/grading/status_updates) run the following command:

`npm run status-updates`

This will produce `status-updates.csv` and `status-updates.json`

## Getting the data files

Data files (users.json, projects.json etc.) should be stored in the collections directory.

To generate a collections directory, execute the following command on a server running Observatory.

```javascript
mkdir collections
mongoexport --db observatory3 --collection users --out collections/users.json
mongoexport --db observatory3 --collection projects --out collections/projects.json
mongoexport --db observatory3 --collection classyears --out collections/classyears.json
mongoexport --db observatory3 --collection posts --out collections/posts.json
```
