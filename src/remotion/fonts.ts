import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadPlusJakartaSans } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const poppins = loadPoppins("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const spaceGrotesk = loadSpaceGrotesk("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const plusJakartaSans = loadPlusJakartaSans("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const dmSans = loadDMSans("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const sora = loadSora("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const FONT_FAMILY = `${inter.fontFamily}, sans-serif`;
export const FONT_POPPINS = `${poppins.fontFamily}, sans-serif`;
export const FONT_SPACE_GROTESK = `${spaceGrotesk.fontFamily}, sans-serif`;
export const FONT_JAKARTA = `${plusJakartaSans.fontFamily}, sans-serif`;
export const FONT_DM_SANS = `${dmSans.fontFamily}, sans-serif`;
export const FONT_SORA = `${sora.fontFamily}, sans-serif`;
