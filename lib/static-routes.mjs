// The same paths work in generated HTML and the local development server.
export function pageOptions(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "products") {
    if (parts[1] && parts[1] !== "index.html") {
      let productId;
      try { productId = decodeURIComponent(parts[1]); } catch { productId = ""; }
      return { mode: "detail", productId };
    }
    return { mode: "catalog", initialCategory: "all" };
  }
  if (parts[0] === "404.html") return { mode: "detail", productId: "" };
  return { mode: "home" };
}
