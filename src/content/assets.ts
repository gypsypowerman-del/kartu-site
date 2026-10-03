// Flip to true once the client's photography and logo files are in /public/images.
// Until then every Photo/Logo renders a labelled khaki placeholder of the right size.
export const PHOTOS_READY = true;
export const LOGO_READY = true;
// Open client items — flip / fill when supplied.
export const FOUNDER_PORTRAITS = false;
export const INSTAGRAM_URL = ""; // e.g. "https://www.instagram.com/<handle>/"

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => base + p;
