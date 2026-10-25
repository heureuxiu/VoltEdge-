export const adminSite = {
  name: "VoltEdge",
  /** URL of the public storefront app (separate Next.js app/port). Override with NEXT_PUBLIC_STORE_URL in production. */
  storeUrl: process.env.NEXT_PUBLIC_STORE_URL ?? "http://localhost:3000",
};
