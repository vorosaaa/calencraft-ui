import React, { useState, useEffect } from "react";
import { Fab, useTheme } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import { useScrollTrigger, Zoom } from "@mui/material";
import { Box } from "@mui/system";

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);
  const theme = useTheme();

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll back to the top
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Zoom in={showButton}>
      <Box
        sx={{
          position: "fixed",
          bottom: theme.spacing(2),
          right: theme.spacing(2),
        }}
      >
        <Fab color="primary" size="small" onClick={handleClick}>
          <KeyboardArrowUp />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollToTopButton;
