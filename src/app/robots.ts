import type { MetadataRoute } from "next";
import { abs, IS_PREVIEW } from "@/content/seo";

export const dynamic = "force-static";

/** Preview: keep the whole site out of search engines. Production: open, with the sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (IS_PREVIEW) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: abs("/sitemap.xml") };
}
