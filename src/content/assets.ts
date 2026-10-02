// Flip to true once the client's photography and logo files are in /public/images.
// Until then every Photo/Logo renders a labelled khaki placeholder of the right size.
export const PHOTOS_READY = true;
export const LOGO_READY = true;

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => base + p;
