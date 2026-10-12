/** Contact details shown across the site. */
export const SITE = {
  phones: ["01-82737", "+977 9876462678"],
  footerPhone: "+977 1 5521098",
  email: "brewhousekathmandu@gmail.com",
  footerEmail: "hello@brewhousektm.com",
  address: "Makhhu Galli, Patan, Lalitpur",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Makhhu+Galli+Patan+Lalitpur",
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
} as const;

export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "story", label: "Our Story" },
  { id: "menu", label: "Menu" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact Us" },
] as const;

export const formatPrice = (n: number) => `Rs. ${n.toLocaleString("en-IN")}`;
