import 'dotenv/config';
import Scanner from './lib/Scanner.mjs';

const { GITHUB_API_TOKEN, ORG, TEAM,OWNER } = process.env;

function logDetails({ description, data }) {
  console.log(`\n${description}`);
  Object.entries(data).forEach(([k, v]) => console.log(`  ${k}: ${v.length}`));
}
(async () => {
  try {
    const scanner = new Scanner({
      auth: GITHUB_API_TOKEN,
      org: ORG,
      team: TEAM,
      owner: OWNER,
    });
    await scanner.fetchOrgData();
    scanner.getPullsByMember();
    logDetails({ description: 'People with open PRs:', data: scanner.pullsByAssignee });
    logDetails({ description: 'People requested on reviews:', data: scanner.pullsByReviewer });
    logDetails({ description: 'PRs by Repo:', data: scanner.getPullsByRepo() });
    console.log('\n');
    process.exit(0)
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
