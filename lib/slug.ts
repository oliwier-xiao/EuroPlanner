const PL_TRANSLITERATION: Record<string, string> = {
  ą: "a", Ą: "a",
  ć: "c", Ć: "c",
  ę: "e", Ę: "e",
  ł: "l", Ł: "l",
  ń: "n", Ń: "n",
  ó: "o", Ó: "o",
  ś: "s", Ś: "s",
  ź: "z", Ź: "z",
  ż: "z", Ż: "z",
};

const NANOID_ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789";

function transliterate(input: string): string {
  let output = "";
  for (const char of input) {
    output += PL_TRANSLITERATION[char] ?? char;
  }
  return output;
}

export function slugifyTitle(title: string): string {
  const transliterated = transliterate(title.trim().toLowerCase());

  const ascii = transliterated
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const slug = ascii
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");

  return slug || "trip";
}

export function generateSlugSuffix(length = 4): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let suffix = "";
  for (let i = 0; i < length; i++) {
    suffix += NANOID_ALPHABET[bytes[i] % NANOID_ALPHABET.length];
  }
  return suffix;
}

export function buildTripSlug(title: string): string {
  return `${slugifyTitle(title)}-${generateSlugSuffix(4)}`;
}
