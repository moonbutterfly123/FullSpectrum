import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: absoluteUrl("/"),
    name: SITE_NAME,
    short_name: "Full Spectrum",
    description: SITE_DESCRIPTION,
    start_url: absoluteUrl("/"),
    scope: absoluteUrl("/"),
    display: "standalone",
    background_color: "#f7f3eb",
    theme_color: "#9a4e2a",
    lang: "en",
  };
}
