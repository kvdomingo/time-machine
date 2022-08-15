import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ['"Nunito"', "sans-serif"].join(", "),
  },
});

export default responsiveFontSizes(theme);
