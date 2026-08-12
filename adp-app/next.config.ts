import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ADP integration export: keep the React app isolated while emitting a
  // deployable static route under Dynasty Hub's existing /adp/ path.
  output: "export",
  basePath: "/adp",
  trailingSlash: true,
};

export default nextConfig;
