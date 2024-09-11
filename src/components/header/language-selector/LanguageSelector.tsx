import React from "react";
import {
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import ReactCountryFlag from "react-country-flag";

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
            <ReactCountryFlag
              countryCode={selectedLanguage?.country || ""}
              svg
              style={{
                width: "1.5em",
                height: "1.5em",
              }}
            />
          );
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <ReactCountryFlag
              countryCode={lang.country}
              svg
              style={{
                width: "1.5em",
                height: "1.5em",
                marginRight: "0.5em",
              }}
            />
            {lang.code.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
