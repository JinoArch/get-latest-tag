const core = require('@actions/core');
const {Octokit} = require("@octokit/rest");
const {cmpTags} = require("tag-cmp");

const octokit = new Octokit({auth: core.getInput("githubToken")});
const repository = core.getInput("repository");

async function run() {
    try{
        const splitrepositoryString = repository.split("/");
        const [owner, repo] = splitrepositoryString;
        [latest, previous] = await latestTag(owner, repo)
        console.log(latest, previous)
        core.setOutput("latestTag", latest)
        core.setOutput("previousTag", previous)
    }catch (error) {
        core.setFailed(error);
    }
}

async function latestTag(owner, repo){
    const endpoint = octokit.repos.listTags;
    const pages = endpoint.endpoint.merge({"owner": owner, "repo": repo, "per_page": 100}); 
    
    const tags = [];
    for await (const item of getItemsFromPages(pages)) {
        const tag = item["name"];
        tags.push(tag);
    }
    if (tags.length === 0) {
        let error = `The repository "${owner}/${repo}" has no tags defined`;
        throw error;
    }
    tags.sort(cmpTags);
    const [latestTag] = tags.slice(-1);
    const [previousTag] = tags.slice(-2);
    return [latestTag, previousTag];
    
}

async function* getItemsFromPages(pages) {
    for await (const page of octokit.paginate.iterator(pages)) {
        for (const item of page.data) {
            yield item;
        }
    }
}

if (require.main === module) {
    run();
}