import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Homes for Sale in Northern Colorado | Porter Real Estate",
  description: "Search thousands of homes for sale in Northern Colorado. Find your perfect property with advanced search filters, interactive maps, and expert local guidance.",
  openGraph: {
    title: "Search Northern Colorado Homes | Porter Real Estate",
    description: "Find your dream home in Northern Colorado with our advanced property search.",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
