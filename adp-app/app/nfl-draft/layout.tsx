import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFL Draft Player Hit Rates",
  description:
    "Fantasy football career hit rates by NFL Draft round and positional group.",
};

export default function NflDraftLayout({ children }: { children: React.ReactNode }) {
  return children;
}

