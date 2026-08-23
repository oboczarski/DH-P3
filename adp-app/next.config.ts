import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hit-rate integration export: keep both React dashboards isolated while
  // emitting their deployable routes beneath Dynasty Hub's existing /adp path.
  output: "export",
  basePath: "/adp",
  trailingSlash: true,
};

export default nextConfig;
