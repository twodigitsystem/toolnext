const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolnext.vercel.app";
const configuredContactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

export const siteUrl = new URL(configuredSiteUrl).origin;
export const contactEmail =
  configuredContactEmail || "developer.twodigitsystem@gmail.com";
