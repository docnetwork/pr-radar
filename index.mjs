import 'dotenv/config';
import Scanner from './Scanner.mjs';

const {
  GITHUB_API_TOKEN, ORG, TEAM,OWNER
} = process.env;

// async function getPulls(client) {
//   const repos = await getAllRepoNames(client);
//   const repoPulls = {};
//   for (const repo of repos) {
//     const { data } = await client.rest.pulls.list({ repo, owner: OWNER });
//     repoPulls[repo] = data;
//   }
//   return repoPulls;
// }

(async () => {
  try {
    const scanner = new Scanner({
      auth: GITHUB_API_TOKEN,
      org: ORG,
      team: TEAM,
      owner: OWNER,
    });
    const repoPulls = await scanner.getPulls();
    Object.entries(repoPulls).forEach(([k, v]) => console.log(`${k}: ${v.length}`));
    process.exit(0)
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

// (async () => {
//   try {
//     const gh = new GitHub({ token: process.GITHUB_API_TOKEN });
//     const org = await gh.getOrganization('docnetwork');
//     const repos = await org.getRepos();
//     repos.data.forEach(r => console.log(r.name));
//     // const appRepo = await gh.getRepo('docnetwork', 'app');
//     // console.log(appRepo);
//     // console.log(repos);
//     process.exit(0)
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
})();
