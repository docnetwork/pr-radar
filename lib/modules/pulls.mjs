/**
 * Get all PR data for a single repo
 * @param {Object} requestOptions Supported options for the rest.pulls.list endpoint.
 * @returns {Object[]} PR Objects returned by the GitHub REST API v3.
 */
async function getPullsForRepo(requestOptions, libOptions = {}) {
  const { includeDrafts } = libOptions;
  const opts = { state: 'open', owner: this.owner, ...requestOptions };
  const { data } = await this.client.rest.pulls.list(opts);
  if (includeDrafts) {
    return data;
  } else {
    return data.filter(pr => pr.draft !== true);
  }
}

/**
 * Get pull request data for multiple repos
 * @param {string[]} repos Array of repo names to get PR data for
 * @returns {Object[]} Array of objects with the repo name and PR data
 */
async function getPullsForRepos(repos, requestOptions, libOptions = {}) {
  const repoPulls = [];
  for (const repo of repos) {
    repoPulls.push(...await this.getPullsForRepo({ repo }, requestOptions, libOptions))
  }
  return repoPulls;
}

export default {
  getPullsForRepo,
  getPullsForRepos
}
