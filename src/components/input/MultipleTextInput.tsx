import React, { useRef } from "react";
import { Grid, GridSize, TextField, TextFieldProps } from "@mui/material";
import { useCheckMobileScreen } from "../../hooks/screenHook";

type Props = {
  length: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  gridItemSize: GridSize;
} & TextFieldProps;

export const MultipleTextInput = ({
  length,
  type,
  inputValue,
  gridItemSize,
  setInputValue,
  ...props
}: Props) => {
  const isMobile = useCheckMobileScreen();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const newInputValue =
      inputValue.slice(0, index) + value + inputValue.slice(index + 1);
    setInputValue(newInputValue);

    // Focus on the next input if available
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDelete = (index: number) => {
    if (inputValue[index]) {
      const newInputValue =
        inputValue.slice(0, index) + inputValue.slice(index + 1);
      setInputValue(newInputValue);
    } else if (index > 0 && inputRefs.current[index - 1]) {
      const newInputValue =
        inputValue.slice(0, index - 1) + inputValue.slice(index);
      setInputValue(newInputValue);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    setInputValue(pastedData);
  };

  return (
    <Grid
      container
      spacing={1}
      justifyContent={isMobile ? "space-between" : "center"}
    >
      {Array.from({ length }, (_, index) => (
        <Grid item xs={gridItemSize} key={index}>
          <TextField
            type={type}
            variant="outlined"
            value={inputValue[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                handleDelete(index);
              }
            }}
            inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
            onPaste={handlePaste}
            inputRef={(el) => (inputRefs.current[index] = el)}
            {...props}
          />
        </Grid>
      ))}
    </Grid>
  );
};
