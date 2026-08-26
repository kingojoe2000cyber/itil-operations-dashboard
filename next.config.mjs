const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = (process.env.GITHUB_REPOSITORY ?? "").split("/")[1] ?? "";
const isUserOrOrganizationSite = repositoryName.endsWith(".github.io");
const githubBasePath =
  isGitHubPages && repositoryName && !isUserOrOrganizationSite
    ? `/${repositoryName}`
    : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The Sites starter includes Cloudflare-only worker/database globals that
  // are not part of the GitHub Pages static bundle. Application source is
  // linted and validated by the primary production build before this export.
  typescript: { ignoreBuildErrors: isGitHubPages },
  ...(isGitHubPages
    ? {
        output: "export",
        trailingSlash: true,
        basePath: githubBasePath,
        assetPrefix: githubBasePath || undefined,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
