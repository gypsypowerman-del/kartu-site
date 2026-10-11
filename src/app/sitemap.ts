import type { MetadataRoute } from "next";
import { abs } from "@/content/seo";
import { projects } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["/", 1],
    ["/projects/", 0.9],
    ...projects.map((p): [string, number] => [`/projects/${p.slug}/`, 0.8]),
    ["/services/", 0.8],
    ["/studio/", 0.7],
    ["/contact/", 0.7],
    ["/privacy/", 0.2],
  ];
  return pages.map(([path, priority]) => ({ url: abs(path), changeFrequency: "monthly", priority }));
}
