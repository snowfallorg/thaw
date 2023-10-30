export async function fetchVersions(input) {
  return ["v1.0.0", "v2.1.1"];
  const url = new URL(input.url);

  const [owner, repo] = url.pathname.split("/").filter(Boolean);

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/tags`,
  );

  const tags = await response.json();

  return tags.map((tag) => tag.name);
}
