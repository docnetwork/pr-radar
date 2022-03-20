import 'dotenv/config';
import Scanner from './lib/Scanner.mjs';

const { GITHUB_API_TOKEN, ORG, TEAM,OWNER } = process.env;

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
})();
