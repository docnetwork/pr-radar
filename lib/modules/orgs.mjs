/**
 * Get all PR data for a single repo
 * @param {Object} requestOptions Supported options for the rest.pulls.list endpoint.
 * @returns {Object[]} PR Objects returned by the GitHub REST API v3.
 */
async function listOrgMembers(requestOptions) {
  const opts = { org: this.org, per_page: 100, ...requestOptions };
  const { data } = await this.client.rest.pulls.list(opts);
  return data;
}

export default {
  listOrgMembers
}
