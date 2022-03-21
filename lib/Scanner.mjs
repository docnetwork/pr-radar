import { Octokit } from "octokit";
import _ from 'lodash';
import { register } from "../util/register-module.mjs";

// Import extracted class methods for registration
import repos from "./modules/repos.mjs";
import pulls from "./modules/pulls.mjs"
import orgs from "./modules/orgs.mjs"

const PR_BY_REPO_LOOKUP = 'base.repo.name';
const PR_BY_USER_LOOKUP = 'login';

export default class Scanner {
  // Define some private keys because it's hot right now.
  #auth
  #org
  #team
  #owner
  #repos
  #pulls
  #members
  #pullsByRepo
  #pullsByMember

  constructor({ auth, org, team, owner }) {
    this.#auth = auth;
    this.#org = org;
    this.#team = team;
    this.#owner = owner;
    this.#repos = [];
    this.#pulls = [];
    this.#members = [];
    this.client = new Octokit({ auth: this.#auth });

    // Register extracted class methods
    register(repos, this);
    register(pulls, this);
    register(orgs, this);
  }

  async fetchOrgData() {
    this.#repos = await this.getAllRepos();
    const filteredRepos = this.#repos.filter(r => r.open_issues_count && r.open_issues_count > 0);
    this.#pulls = await this.getPullsForRepos(filteredRepos.map(r => r.name));
    this.#members = await this.listOrgMembers();
  }

  getPullsByRepo(forceUpdate=false) {
    // Used cached copy if possible. If not, recalculate.
    if (!this.#pullsByRepo || forceUpdate) {
      this.#pullsByRepo = this.#pulls.reduce((pullsByRepo, pr, i) => {
        this.#assignOrPush(pullsByRepo, _.get(pr, PR_BY_REPO_LOOKUP), pr);
        return pullsByRepo;
      }, {});
    }

    return this.#pullsByRepo;
  }

  getPullsByMember(forceUpdate=false) {
    const self = this;
    // Used cached copy if possible. If not, recalculate.
    if (!self.#pullsByMember || forceUpdate) {
      self.#pullsByMember = self.#pulls.reduce((pullsByMember, pr) => {
        const keysToAgg = [ 'assignees', 'requested_reviewers' ];
        keysToAgg.forEach(k => {
          if (pr[k].length) {
            pr[k].forEach(user => {
              self.#assignOrPush(pullsByMember[k], _.get(user, PR_BY_USER_LOOKUP), pr);
            });
          } else {
            self.#assignOrPush(pullsByMember[k], 'unassigned', pr);
          }
        })
        return pullsByMember;
      }, { assignees: {}, requested_reviewers: {} });
    }

    return self.#pullsByMember;
  }

  /**
   * Helper utility for assigning and filling arrays of objects.
   * @param {Object} obj The object to create a key on
   * @param {string} key Key to create
   * @param {*} member Member to push into the array specified at obj[key]
   */
  #assignOrPush(obj, key='unassigned', member) {
    if (!obj[key]) obj[key] = [ member ];
    else obj[key].push(member);
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
  get repos() {
    return this.#repos;
  }
  get pulls() {
    return this.#pulls;
  }
  get members() {
    return this.#members;
  }
  get pullsByReviewer() {
    return this.#pullsByMember.requested_reviewers;
  }
  get pullsByAssignee() {
    return this.#pullsByMember.assignees;
  }
}
