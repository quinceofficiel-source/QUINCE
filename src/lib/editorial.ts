import type { EditorialCampaign } from "@/lib/admin/types";

export type EditorialBanner = Pick<
  EditorialCampaign,
  | "id"
  | "title"
  | "subtitle"
  | "buttonLabel"
  | "buttonLink"
  | "image"
  | "backgroundColor"
  | "textColor"
  | "badge"
  | "campaignType"
>;

export function isEditorialLive(campaign: EditorialCampaign, now = new Date()) {
  if (!campaign.active) return false;
  const start = new Date(campaign.startsAt).getTime();
  const end = new Date(campaign.endsAt).getTime();
  const t = now.getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return campaign.active;
  return t >= start && t <= end;
}

export function pickActiveEditorial(campaigns: EditorialCampaign[], now = new Date()): EditorialBanner | null {
  const live = campaigns
    .filter((item) => isEditorialLive(item, now))
    .sort((a, b) => a.order - b.order);
  const hit = live[0];
  if (!hit) return null;
  return {
    id: hit.id,
    title: hit.title,
    subtitle: hit.subtitle,
    buttonLabel: hit.buttonLabel,
    buttonLink: hit.buttonLink,
    image: hit.image,
    backgroundColor: hit.backgroundColor,
    textColor: hit.textColor,
    badge: hit.badge,
    campaignType: hit.campaignType,
  };
}

export function safeEditorialHref(href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return "/";
  return href;
}
