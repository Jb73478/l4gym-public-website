import type { MetadataRoute } from "next";
export default function sitemap():MetadataRoute.Sitemap{const routes=["","/what-we-do","/machinedna","/equipment","/service-support","/manufacturers-oem","/distributors-partners","/about","/contact"];return routes.map(route=>({url:`https://www.l4gym.com${route}`,changeFrequency:"monthly",priority:route?0.7:1}))}
