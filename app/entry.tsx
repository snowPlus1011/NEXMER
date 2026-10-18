import { createRoot, hydrateRoot } from "react-dom/client";
import Site from "./site";
import content from "../generated/content.json";
import type { ContentData } from "../lib/content-types";
import { pageOptions } from "../lib/static-routes.mjs";
import "./globals.css";

const root = document.getElementById("root")!;
const page = JSON.parse(document.getElementById("page-data")?.textContent || "{}");
const options = page.mode ? page : pageOptions(window.location.pathname);
const site = <Site initialContent={content as ContentData} {...options} />;
if (root.hasChildNodes()) hydrateRoot(root, site);
else createRoot(root).render(site);
