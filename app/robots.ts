import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://efchamps.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/register", "/login", "/terms", "/privacy"],
        disallow: ["/admin/", "/admin/*", "/dashboard/", "/match/*", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
