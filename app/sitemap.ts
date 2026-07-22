import type { MetadataRoute } from "next";

const base = "https://briancabrera.io";

// Public pages only. Login, register, dashboard, and auth callbacks stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/projects",
    "/data-lab",
    "/geo-lab",
    "/playground",
    "/chaos-lab",
    "/gravity-lab",
    "/security-lab",
    "/travel",
    "/ai-workflow",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/projects" ? 0.9 : 0.7,
  }));
}
