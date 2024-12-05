import { createSystem, defaultConfig } from "@chakra-ui/react"


export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          background: { value: "#1D1D1D" },
          primary: {
            50: { value: "#E5F6E7" },
            100: { value: "#C6EFD5" },
            200: { value: "#A1E1A2" },
            300: { value: "#7BDB70" },
            400: { value: "#04A51E" },
            500: { value: "#038A17" },
            600: { value: "#027E14" },
            700: { value: "#026A11" },
            800: { value: "#02560E" },
            900: { value: "#024A0C" },
          },
          secondary: {
            50: { value: "#F2F2F2" },
            100: { value: "#D9D9D9" },
            200: { value: "#BFBFBF" },
            300: { value: "#A6A6A6" },
            400: { value: "#8C8C8C" },
            500: { value: "#737373" },
            600: { value: "#595959" },
            700: { value: "#404040" },
            800: { value: "#262626" },
            900: { value: "#0D0D0D" },
          },
          outline: { value: "#3F3F3F" },

        },
      },
    },
  },
});

