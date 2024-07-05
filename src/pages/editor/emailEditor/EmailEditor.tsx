import React, { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Container,
  IconButton,
  TextField,
  Tab,
  Tabs,
  Box,
  Typography,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PreviewModal } from "./PreviewModal";
import { useMe } from "../../../queries/queries";
import { useMutation, useQueryClient } from "react-query";
import { saveEmail } from "../../../api/userApi";
import { enqueueError, enqueueSuccess } from "../../../enqueueHelper";

export const EmailEditor = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [header, setHeader] = useState("");
  const [bodySections, setBodySections] = useState<string[]>([""]);
  const [footer, setFooter] = useState("");
  const [activeInput, setActiveInput] = useState<HTMLInputElement | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Query
  const { data } = useMe();
  const { mutate } = useMutation(saveEmail, {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      data.success
        ? enqueueSuccess(t(`messages.success.${data.message}`))
        : enqueueError(t(`messages.errors.${data.message}`));
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });

  const onSave = () => {
    mutate({
      emailHeader: header,
      emailBody: bodySections,
      emailFooter: footer,
    });
  };

  useEffect(() => {
    const handleFocusChange = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target instanceof HTMLInputElement) {
        setActiveInput(target);
      }
    };

    document.addEventListener("focusin", handleFocusChange);

    return () => {
      document.removeEventListener("focusin", handleFocusChange);
    };
  }, []);
  useEffect(() => {
    setHeader(data.user.emailHeader);
    setBodySections(data.user.emailBody);
    setFooter(data.user.emailFooter);
  }, [data]);

  const handlePreviewOpen = () => setPreviewOpen(true);
  const handlePreviewClose = () => setPreviewOpen(false);

  // Function to handle adding a new section to the body
  const addNewSection = () => {
    setBodySections([...bodySections, ""]);
  };

  // Function to handle changing a body section
  const handleBodySectionChange = (index: number, value: string) => {
    const updatedSections = [...bodySections];
    updatedSections[index] = value;
    setBodySections(updatedSections);
  };

  // Function to handle removing a body section
  const removeSection = (index: number) => {
    const updatedSections = bodySections.filter((_, i) => i !== index);
    setBodySections(updatedSections);
  };

  // Function to handle adding a shorthand to the input field
  const addShorthand = (shorthand: string) => {
    if (!activeInput) return;

    const input = activeInput;
    const start = input.selectionStart as number;
    const end = input.selectionEnd as number;

    const currentValue = input.value;
    const newValue =
      currentValue.substring(0, start) +
      shorthand +
      currentValue.substring(end);

    input.setSelectionRange(start + shorthand.length, start + shorthand.length);

    if (input.name === "header") {
      setHeader(newValue);
    } else if (input.name.startsWith("body")) {
      const index = parseInt(input.name.split("-")[1]);
      const updatedSections = [...bodySections];
      updatedSections[index] = newValue;
      setBodySections(updatedSections);
    } else if (input.name === "footer") {
      setFooter(newValue);
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
  };

  // List of predefined shorthands
  const shorthands: { value: string; text: string }[] = [
    { value: "$user", text: "editor.email_editor.user" },
    { value: "$bookingName", text: "editor.email_editor.booking_name" },
    { value: "$start", text: "editor.email_editor.start" },
    { value: "$end", text: "editor.email_editor.end" },
  ];

  const handleChange = (newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Container>
      <Typography variant="caption" sx={{ marginBottom: 4 }}>
        {t("editor.email_editor.description")}
      </Typography>
      <PreviewModal
        open={previewOpen}
        handleClose={handlePreviewClose}
        header={header}
        bodySections={bodySections}
        footer={footer}
      />
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "4px" }}
      >
        {shorthands.map((shorthand, index) => (
          <div key={index} style={{ marginTop: 1 }}>
            <Chip
              label={t(shorthand.text)}
              onClick={() => addShorthand(shorthand.value)}
              sx={{ cursor: "pointer", mr: 1 }}
            />
          </div>
        ))}
      </div>
      <Tabs
        sx={{ mb: 2 }}
        value={tabIndex}
        onChange={(event, newValue) => handleChange(newValue)}
        variant="fullWidth"
        indicatorColor="primary"
      >
        <Tab label={t("editor.email_editor.header")} />
        <Tab label={t("editor.email_editor.body")} />
        <Tab label={t("editor.email_editor.footer")} />
      </Tabs>
      <Box>
        {tabIndex === 0 && (
          <TextField
            name="header"
            fullWidth
            value={header}
            onChange={(e) => setHeader(e.target.value)}
          />
        )}
        {tabIndex === 1 && (
          <Box id="body-tab-content">
            {bodySections.map((section, index) => (
              <TextField
                sx={{ mb: 1 }}
                key={index}
                fullWidth
                name={`body-${index}`}
                value={section}
                onChange={(e) => handleBodySectionChange(index, e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      color="primary"
                      onClick={() => removeSection(index)}
                      sx={{ padding: 0 }}
                    >
                      <Clear sx={{ fontSize: "1.2em" }} />
                    </IconButton>
                  ),
                }}
              />
            ))}
          </Box>
        )}
        {tabIndex === 2 && (
          <TextField
            name="footer"
            fullWidth
            value={footer}
            onChange={(e) => setFooter(e.target.value)}
          />
        )}
      </Box>
      <Container
        disableGutters
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button variant="outlined" onClick={handlePreviewOpen}>
          {t("editor.email_editor.preview")}
        </Button>
        {tabIndex === 1 && (
          <Button variant="outlined" onClick={addNewSection}>
            {t("editor.email_editor.add_new_section")}
          </Button>
        )}
        <Button
          sx={{ alignSelf: "flex-end" }}
          variant="contained"
          onClick={onSave}
        >
          {t("editor.email_editor.save")}
        </Button>
      </Container>
    </Container>
  );
};
