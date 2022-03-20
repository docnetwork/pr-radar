import { Octokit } from "octokit";
import { register } from "./util/register-module.mjs";

// Import extracted class methods for registration
import repos from "./modules/repos.mjs";

export default class Scanner {
  // Define some private keys because it's hot right now.
  #auth
  #org
  #team
  #owner

  constructor({ auth, org, team, owner }) {
    this.#auth = auth;
    this.#org = org;
    this.#team = team;
    this.#owner = owner;
    this.client = new Octokit({ auth: this.#auth });

    // Register extracted class methods
    register(repos, this);
  }

  async getPulls() {
    const repos = await this.getAllRepoNames();
    const repoPulls = {};
    for (const repo of repos) {
      const method = this.client.rest.pulls.list;
      const { data } = await method({ repo, owner: this.owner });
      repoPulls[repo] = data;
    }
    return repoPulls;
  }


  // Give read-only access to private keys set at instantiation.
  get org() {
    return this.#org;
  }
  get team() {
    return this.#team;
  }
  get owner() {
    return this.#owner;
  }
}
