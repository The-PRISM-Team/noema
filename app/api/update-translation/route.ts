const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SOURCE_OWNER = "The-PRISM-Team";
const SOURCE_REPO = "noema";

interface GitHubError {
    message: string;
    documentation_url?: string;
}

interface UpdateLocaleRequest {
    code: string;
    content: string;
}

async function githubFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    return fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
}

async function getAuthenticatedUser(): Promise<string> {
    const response = await githubFetch("https://api.github.com/user");
    if (!response.ok) {
        throw new Error("Failed to get authenticated user");
    }
    const user = await response.json();
    return user.login;
}

async function forkExists(owner: string, repo: string): Promise<boolean> {
    const response = await githubFetch(
        `https://api.github.com/repos/${owner}/${repo}`
    );
    return response.ok;
}

async function createFork(username: string): Promise<void> {
    if (await forkExists(username, SOURCE_REPO)) {
        return;
    }

    const response = await githubFetch(
        `https://api.github.com/repos/${SOURCE_OWNER}/${SOURCE_REPO}/forks`,
        {
            method: "POST",
            body: JSON.stringify({}),
        }
    );

    if (!response.ok) {
        const error: GitHubError = await response.json();
        throw new Error(`Failed to create fork: ${error.message}`);
    }

    // Wait for fork to be ready (GitHub forks are async)
    let attempts = 0;
    while (attempts < 10) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (await forkExists(username, SOURCE_REPO)) {
            return;
        }
        attempts++;
    }
    throw new Error("Fork creation timed out");
}

async function getDefaultBranch(owner: string, repo: string): Promise<string> {
    const response = await githubFetch(
        `https://api.github.com/repos/${owner}/${repo}`
    );
    if (!response.ok) {
        throw new Error("Failed to get repository info");
    }
    const repoInfo = await response.json();
    return repoInfo.default_branch;
}

async function fileExists(
    owner: string,
    repo: string,
    path: string,
    branch: string
): Promise<{ exists: boolean; sha?: string }> {
    const response = await githubFetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
    );
    if (response.ok) {
        const file = await response.json();
        return { exists: true, sha: file.sha };
    }
    return { exists: false };
}

async function createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    branch: string,
    existingSha?: string
): Promise<void> {
    const body: Record<string, string> = {
        message: existingSha
            ? `Update locale file ${path}`
            : `Create locale file ${path}`,
        content: Buffer.from(content).toString("base64"),
        branch,
    };

    if (existingSha) {
        body.sha = existingSha;
    }

    const response = await githubFetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
            method: "PUT",
            body: JSON.stringify(body),
        }
    );

    if (!response.ok) {
        const error: GitHubError = await response.json();
        throw new Error(`Failed to create/update file: ${error.message}`);
    }
}

async function createBranch(
    owner: string,
    repo: string,
    branchName: string,
    baseBranch: string
): Promise<void> {
    const refResponse = await githubFetch(
        `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${baseBranch}`
    );
    if (!refResponse.ok) {
        throw new Error("Failed to get base branch reference");
    }
    const refData = await refResponse.json();
    const baseSha = refData.object.sha;

    const createResponse = await githubFetch(
        `https://api.github.com/repos/${owner}/${repo}/git/refs`,
        {
            method: "POST",
            body: JSON.stringify({
                ref: `refs/heads/${branchName}`,
                sha: baseSha,
            }),
        }
    );

    if (!createResponse.ok) {
        const error: GitHubError = await createResponse.json();
        if (!error.message.includes("Reference already exists")) {
            throw new Error(`Failed to create branch: ${error.message}`);
        }
    }
}

async function createPullRequest(
    username: string,
    code: string,
    branchName: string
): Promise<string> {
    const response = await githubFetch(
        `https://api.github.com/repos/${SOURCE_OWNER}/${SOURCE_REPO}/pulls`,
        {
            method: "POST",
            body: JSON.stringify({
                title: `Update translation file (${code})`,
                head: `${username}:${branchName}`,
                base: "main",
                body: `This PR updates or creates the locale file for \`${code}\`.\n\nSubmitted via the translation API.`,
            }),
        }
    );

    if (!response.ok) {
        const error: GitHubError = await response.json();
        if (error.message.includes("A pull request already exists")) {
            return "Pull request already exists for this branch";
        }
        throw new Error(`Failed to create pull request: ${error.message}`);
    }

    const pr = await response.json();
    return pr.html_url;
}

export async function POST(request: Request) {
    if (!GITHUB_TOKEN) {
        return Response.json(
            { error: "GitHub token not configured" },
            { status: 500 }
        );
    }

    let body: UpdateLocaleRequest;
    try {
        body = await request.json();
    } catch {
        return Response.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    const { code, content } = body;

    if (!code || !content) {
        return Response.json(
            { error: "Missing required fields: code and content" },
            { status: 400 }
        );
    }

    try {
        const filePath = `src/locales/${code}.js`;
        const branchName = `update-locale-${code}-${Date.now()}`;

        // Get authenticated user
        const username = await getAuthenticatedUser();

        // Create fork if it doesn't exist
        await createFork(username);

        // Get default branch of fork
        const defaultBranch = await getDefaultBranch(username, SOURCE_REPO);

        // Create a new branch for this update
        await createBranch(username, SOURCE_REPO, branchName, defaultBranch);

        // Check if file exists in the fork
        const { exists, sha } = await fileExists(
            username,
            SOURCE_REPO,
            filePath,
            branchName
        );

        // Create or update the file
        await createOrUpdateFile(
            username,
            SOURCE_REPO,
            filePath,
            content,
            branchName,
            sha
        );

        // Create pull request to source repo
        const prUrl = await createPullRequest(username, code, branchName);

        return Response.json({
            success: true,
            message: exists
                ? `Updated locale file for ${code}`
                : `Created locale file for ${code}`,
            pullRequestUrl: prUrl,
            filePath,
        });
    } catch (error) {
        console.error("Error processing locale update:", error);
        return Response.json(
            {
                error:
                    error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}
