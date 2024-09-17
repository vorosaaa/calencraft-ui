import React from "react";
import {
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
  Box,
} from "@mui/material";

interface LanguageSelectorProps {
  currentLanguage: string;
  onChangeLanguage: (language: string) => void;
}

const languages = [
  { code: "en", country: "GB" },
  { code: "hu", country: "HU" },
  // Add more languages as needed
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onChangeLanguage,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChangeLanguage(event.target.value as string);
  };

  return (
    <FormControl variant="outlined" size="small">
      <Select
        value={currentLanguage}
        onChange={handleChange}
        renderValue={(selected) => {
          const selectedLanguage = languages.find(
            (lang) => lang.code === selected,
          );
          return (
            <img
              loading="lazy"
              width="32"
              srcSet={`https://flagcdn.com/w40/${selectedLanguage?.country.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${selectedLanguage?.country.toLowerCase()}.png`}
              alt=""
            />
          );
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box
              component="img"
              sx={{
                marginRight: 1
              }}
              alt=""
              loading="lazy"
              width="28"
              srcSet={`https://flagcdn.com/w40/${lang.country.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${lang.country.toLowerCase()}.png`}
            />            
            {lang.code.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
