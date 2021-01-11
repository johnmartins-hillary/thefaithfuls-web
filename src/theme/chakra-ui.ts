import {theme as initialTheme,DefaultTheme,extendTheme} from "@chakra-ui/react"
import colors,{primary} from "./palette"
import "assets/styles/index.css"

const drawerStyle = {
  baseStyle:{},
  size:{
    display:"none",
  },
  variants:{
    open:{
      display:"none"
    }
  },
  defaultProps:{
    size:"10rem",
    variant:"normal"
  }
}

const Input = {
  // The styles all Input have in common
  baseStyle: {
    fontWeight: "bold",
    fontSize:"1.3rem",
    fontFamily:"MulishRegular"
  },
  // Two sizes: sm and md
  sizes: {
    md: {
    }
  },
  // Two variants: outline and solid
  variants: {
    solid: {
      border:"1px solid rgba(0, 0, 0, .3)",
      // opacity:.9,
      bgColor:"white",
      borderRadius:"4px",
      color:"#00000099",
      fontSize:"1.25rem",
      letterSpacing:".15px",
      _placeholder:{
        color:"grey",
        opacity:.74
      }
    }
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "solid",
  },
}

const theme:DefaultTheme & any =  {
    ...initialTheme,
    colors:{
      ...colors
    },
    fonts: {
      heading: 'MulishRegular',
      body: 'MulishRegular',
      mono: 'Bahnschrift',
    },
    // lineHeights:{
    //   ...initialTheme.lineHeights,
    //   base:'19px',
    //   normal:'22px',
    //   tall:"26px",
    //   taller:"42px"
    // },
    space:{
      ...initialTheme.space,
      "1":"0.10rem",
      "7":"1.3rem",
      "9":"2.3rem",
      "18":'4.4rem',
      "19":'4.7rem'
    },
    sizes:{
      ...initialTheme.sizes,
      "1xs":"18rem"
    },
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
    },
    textStyles:{
      MulishRegularRegular:{
        fontFamily:"MulishRegular",
        fontStyle:"normal",
        fontWeight:"normal",
      },
      style1:{
        fontSize:"0.9375rem",
        lineHeight:"29px",
        letterSpacing:"0px"
      },
      style2:{
        fontFamily:"MulishRegular",
        fontStyle:"normal",
        fontWeight:"normal",
        fontSize:"1.1875rem",
        lineHeight:"24px",
        letterSpacing:"0px"
      },
      style3:{
        fontFamily:"MulishRegular",
        fontStyle:"normal",
        fontWeight:"normal",
        fontSize:"0.9375rem",
        lineHeight:"19px",
        letterSpacing:"0px"
      },
      style4:{
        fontFamily:"MulishRegular",
        fontStyle:"normal",
        fontWeight:"normal",
        fontSize:"0.9375rem",
        lineHeight:"21px",
        letterSpacing:"0px"
      },
      // h3:{
      //   fontWeight:400,
      //   whiteSpace:["normal","nowrap"],
      //   textAlign:["center","left"]
      // },
      h4:{
        fontSize:"1.875rem",
        color:primary,
        fontFamily:"MulishRegular",
        fontWeight:400
      },
      // h5:{
      //   fontSize:"1.5rem",
      //   color:"tertiary"
      // },
      h6:{
        // fontSize:"1.125rem",
        // color:"#383838",
        // opacity:.8,
        // textAlign:["center", "left"],
        // fontWeight:400
      }
    },
    components:{
      drawer:drawerStyle,
      Input,
      Button:{
        baseStyle:{
          colorScheme:"primary",
          fontWeight:400
        },
        variants:{
          solid:{
            colorScheme:"primary",
          },
          outline:{
            colorScheme:"primary",
          },
          link:{
            colorScheme:"primary",
          },
        }
      }
    },
    // global:{
    //   "button":{
    //     backgroundColor:"#B603C9",
    //     color:"white"
    //   }
    // }
  };

export default extendTheme(theme)