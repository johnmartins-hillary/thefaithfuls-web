import {theme} from "@chakra-ui/react"


const {colors} = theme;

export const primary = "#B603C9"
export const bgColor = "#F9F5F9"
export const bgColor2 = "#F3F3F3"
export const buttonBackground = "#151C4D1A"
export const avatarBg = "#CCCCCC"
export const inputColor = "#00000099"
export const activityHeader = "#E1DFDF"
export const tertiary = "#151C4D"
const chipBackgroundColor = "#E9E9E9"
const chipDeleteColor = "#5D5D5D"
const activityLogo = "#38383880"
const secondary = "#383838"
const white = "#ffffff"
const outlinePrimary = "rgba(181, 3, 201, 0.1)"

export default {
  ...colors,
  bgColor,
  avatarBg,
  inputColor,
  chipDeleteColor,
  bgColor2,
  chipBackgroundColor,
  activityLogo,
  activityHeader,
  primary,
  secondary,
  tertiary,
  white,
  outlinePrimary
} as any;