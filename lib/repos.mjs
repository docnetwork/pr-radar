/**
 * Gets all the repo data for ORG and TEAM (defined in .env). Intentionally does not catch errors.
 * The caller should handle errors.
 * @param {Octokit} client Instance of octokit to use for making calls
 * @returns {Object[]} An array of repo objects
 */
async function getAllRepos() {
  const paginator = this.client.paginate.iterator;
  const method = this.client.rest.teams.listReposInOrg;
  const pages = paginator(method, { org: this.org, team_slug: this.team });

  let repos = [];
  for await (const page of pages) {
    repos = [...repos, ...page.data];
  }

  return repos;
}

/**
 * Gets all the repo names for ORG and TEAM (defined in .env). Intentionally does not catch errors.
 * The caller should handle errors.
 * @param {Octokit} client Instance of octokit to use for making calls
 * @returns {string[]} An array of repo names
 */
async function getAllRepoNames() {
  console.log(this);
  const paginator = this.client.paginate.iterator;
  const method = this.client.rest.teams.listReposInOrg;
  const pages = paginator(method, { org: this.org, team_slug: this.team });

  let repos = [];
  for await (const page of pages) {
    const { data } = page;
    data.forEach(r => repos.push(r.name));
  }
  
  return repos
}

export default {
  getAllRepoNames,
  getAllRepos
}
