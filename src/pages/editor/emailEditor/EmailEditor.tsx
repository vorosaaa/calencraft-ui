import { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Container,
  IconButton,
  TextField,
  Box,
  Typography,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore, Info } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PreviewModal } from "./PreviewModal";
import { useMe } from "../../../queries/queries";
import { saveEmail } from "../../../api/userApi";
import { enqueueError, enqueueSuccess } from "../../../enqueueHelper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const EmailEditor = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [emailTemplate, setEmailTemplate] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [activeInput, setActiveInput] = useState<HTMLTextAreaElement | null>(
    null,
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  // Query
  const { data } = useMe();
  const { mutate } = useMutation({
    mutationFn: saveEmail,
    onSuccess: (data: any) => {
      queryClient.refetchQueries({ queryKey: ["me"] });
      if (data.success) {
        enqueueSuccess(t(`messages.success.${data.message}`));
      } else {
        enqueueError(t(`messages.errors.${data.message}`));
      }
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });

  const onSave = () => {
    mutate({
      emailTemplate: emailTemplate,
    });
  };

  useEffect(() => {
    const handleFocusChange = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target instanceof HTMLTextAreaElement) {
        setActiveInput(target);
      }
    };

    document.addEventListener("focusin", handleFocusChange);

    return () => {
      document.removeEventListener("focusin", handleFocusChange);
    };
  }, []);
  useEffect(() => {
    setEmailTemplate(data.user.emailTemplate);
  }, [data]);

  const handlePreviewOpen = () => setPreviewOpen(true);
  const handlePreviewClose = () => setPreviewOpen(false);

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
    setEmailTemplate(newValue);

    input.dispatchEvent(new Event("input", { bubbles: true }));
  };

  // List of predefined shorthands
  const shorthands: { value: string; text: string }[] = [
    { value: "$user", text: "editor.email_editor.user" },
    { value: "$bookingName", text: "editor.email_editor.booking_name" },
    { value: "$start", text: "editor.email_editor.start" },
    { value: "$end", text: "editor.email_editor.end" },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{ border: 0.5, borderRadius: 2, borderColor: "info", p: 1, mb: 2 }}
      >
        <Box display="flex" alignItems="center">
          <Info color="info" sx={{ mr: 1 }} />
          <Typography variant="caption" sx={{ flexGrow: 1 }}>
            {t("editor.email_editor.description")}
          </Typography>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box mt={2}>
            <Typography variant="caption" sx={{ marginBottom: 4 }}>
              {t("editor.email_editor.description_2")}
            </Typography>
            <br />
            <Typography variant="caption">
              {t("editor.email_editor.description_3")}
            </Typography>
          </Box>
        </Collapse>
      </Box>
      <PreviewModal
        open={previewOpen}
        handleClose={handlePreviewClose}
        template={emailTemplate}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "8px",
        }}
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
      <TextField
        sx={{ mt: 2 }}
        fullWidth
        multiline
        rows={10}
        inputProps={{ maxLength: 3000 }}
        value={emailTemplate}
        onChange={(e) => setEmailTemplate(e.target.value)}
      />
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
