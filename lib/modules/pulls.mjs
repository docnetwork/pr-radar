/**
 * Get all PR data for a single repo
 * @param {Object} requestOptions Supported options for the rest.pulls.list endpoint.
 * @returns {Object[]} PR Objects returned by the GitHub REST API v3.
 */
async function getPullsForRepo(requestOptions) {
  const opts = { owner: this.owner, ...requestOptions };
  const { data } = await this.client.rest.pulls.list(opts);
  return data;
}

/**
 * Get pull request data for multiple repos
 * @param {string[]} repos Array of repo names to get PR data for
 * @returns {Object[]} Array of objects with the repo name and PR data
 */
async function getPullsForRepos(repos) {
  const repoPulls = [];
  for (const repo of repos) {
    const pull_requests = await this.getPullsForRepo({ repo });
    repoPulls.push({ repo, pull_requests });
  }
  return repoPulls;
}

export default {
  getPullsForRepo,
  getPullsForRepos
}
