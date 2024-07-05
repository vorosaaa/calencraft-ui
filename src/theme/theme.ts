import { createTheme } from "@mui/material";
import { colors } from "./colors";
import { huHU } from "@mui/x-data-grid/locales";
import { huHU as coreHu } from "@mui/material/locale";
import { huHU as pickersHu } from "@mui/x-date-pickers/locales";

export const customTheme = createTheme(
  {
    palette: {
      primary: {
        main: colors.navyBlue,
      },
      secondary: {
        main: colors.midnightBlue,
      },
    },
  },
  huHU,
  coreHu,
  pickersHu,
);
