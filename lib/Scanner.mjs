import { Octokit } from "octokit";
import { register } from "../util/register-module.mjs";

// Import extracted class methods for registration
import repos from "./modules/repos.mjs";
import pulls from "./modules/pulls.mjs"
import orgs from "./modules/orgs.mjs"

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
    register(pulls, this);
    register(orgs, this);
  }

  // #configureOptionsWithDefaults(requestOptions) {
  //   return {
  //     org: this.#org,
  //     team: this.#team,
  //     owner: this.#owner,
  //     ...requestOptions
  //   }
  // }

  async scanTeamPRs() {
    const repos = await this.getAllRepos();
    const filteredRepos = repos.filter(r => r.open_issues_count && r.open_issues_count > 0);
    const reposWithPRs = await this.getPullsForRepos(filteredRepos.map(r => r.name));
    const sorted = reposWithPRs.sort((a, b) => a.pull_requests.length - b.pull_requests.length);

    sorted.forEach(r => console.log(`${r.repo} ${r.pull_requests.length}`));
    const k8s = sorted.find(({ repo }) => repo === 'k8s-configs');
    console.log(k8s.pull_requests)
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
