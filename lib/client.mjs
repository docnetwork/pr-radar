import { Octokit } from 'octokit';

export function createClient(options){
  return new Octokit({ auth: process.env.GITHUB_API_TOKEN, ...options });
}
