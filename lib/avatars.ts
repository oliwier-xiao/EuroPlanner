export type AvatarCategory = "smiley" | "animal";

export type Avatar = {
  id: string;
  name: string;
  src: string;
  category: AvatarCategory;
};

export const AVATARS: readonly Avatar[] = [
  { id: "yellow-smile", name: "Żółty uśmiech", src: "/images/avatars/yellow-smile.png", category: "smiley" },
  { id: "blue-smile", name: "Niebieski uśmiech", src: "/images/avatars/blue-smile.png", category: "smiley" },
  { id: "green-smile", name: "Zielony uśmiech", src: "/images/avatars/green-smile.png", category: "smiley" },
  { id: "pink-smile", name: "Różowy uśmiech", src: "/images/avatars/pink-smile.png", category: "smiley" },
  { id: "red-smile", name: "Czerwony uśmiech", src: "/images/avatars/red-smile.png", category: "smiley" },
  { id: "fox", name: "Lisek", src: "/images/avatars/fox.png", category: "animal" },
  { id: "penguin", name: "Pingwin", src: "/images/avatars/penguin.png", category: "animal" },
  { id: "monkey", name: "Małpka", src: "/images/avatars/monkey.png", category: "animal" },
  { id: "capybara", name: "Kapibara", src: "/images/avatars/capybara.png", category: "animal" },
  { id: "tiger", name: "Tygrys", src: "/images/avatars/tiger.png", category: "animal" },
] as const;

export const DEFAULT_AVATAR_ID = "yellow-smile";

export function getAvatarById(id: string | null | undefined): Avatar {
  if (!id) return AVATARS.find((a) => a.id === DEFAULT_AVATAR_ID)!;
  return AVATARS.find((a) => a.id === id) ?? AVATARS.find((a) => a.id === DEFAULT_AVATAR_ID)!;
}
