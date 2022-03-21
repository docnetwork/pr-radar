# PR Radar
Got a lot of repos? Hard to keep track of code review as you split out into Microservices? Yeah, we feel that.

This utility helps you see who is requested on what. We use it to:
- Make sure code reviews are fairly distributed
- Make sure our in-flight work isn't getting too backed up
- Find those sneaky PRs in those repos you never touch

## Setup
### Overview
Requires Node 14 or higher.

1. Get a token.
2. `npm install`
3. Create your `.env` file
4. Run `node index.mjs`

### Getting a Token
To get started, you'll need a token for a GitHub OAuth App with `repo` and `read:org` scopes. Learn more about that [here](https://github.com/octokit/octokit.js#authentication).

### Setting up the environment
With token in hand, set up a `.env` file that looks like this:
```
GITHUB_API_TOKEN="<token>"
TEAM="<team name>"
ORG="<org name>"
OWNER="<repo owner (probably just org name again)>"
```

NOTE: The API token is the only one that's really static. The rest are just defaults that can be overridden when instantiating a `Scanner`.

## Using the thing
Right now, this is a super bare bones CLI that just prints some info. That's it. Maybe there will be more later on.
