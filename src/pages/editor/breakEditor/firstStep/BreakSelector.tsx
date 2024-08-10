import { Box, Button, Container, Modal, Typography } from "@mui/material";
import { IconedContainer } from "../../../../components/sessionContainer/IconedContainer";
import { Add, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { BreakStateType } from "../../../../types/breakStateType";
import { colors } from "../../../../theme/colors";
import { useState } from "react";

type Props = {
  breaks: BreakStateType[];
  onDelete: (type: BreakStateType) => void;
  onClick: (type: BreakStateType) => void;
  handleAddNew: () => void;
};

export const BreakSelector = ({
  breaks,
  onDelete,
  onClick,
  handleAddNew,
}: Props) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] =
    useState<BreakStateType | null>(null);

  const handleDeleteClick = (br: BreakStateType) => {
    setSelectedForDeletion(br);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedForDeletion) {
      onDelete(selectedForDeletion);
      setIsModalOpen(false);
      setSelectedForDeletion(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForDeletion(null);
  };
  return (
    <Container sx={{ marginTop: 2, marginBottom: 2 }}>
      {breaks.map((br, index) => (
        <Container key={index} disableGutters sx={{ display: "flex", mb: 1 }}>
          <IconedContainer
            text={br.name}
            style={{ flex: 1 }}
            onClick={() => onClick(br)}
          />
          <Button
            variant="outlined"
            sx={{ p: 1, ml: 1, borderColor: colors.mediumGrey }}
            onClick={() => handleDeleteClick(br)}
          >
            <Delete color="error" />
          </Button>
        </Container>
      ))}

      <IconedContainer
        style={{ marginTop: 32 }}
        text={t("editor.add_break")}
        onClick={handleAddNew}
      >
        <Add color="secondary" fontSize="small" />
      </IconedContainer>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-description"
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: 1,
            boxShadow: 24,
            maxWidth: 400,
            margin: "auto",
            mt: "20%",
          }}
        >
          <Typography
            id="delete-confirmation-modal"
            variant="h6"
            component="h2"
          >
            {t("editor.confirm_delete")}
          </Typography>
          <Typography id="delete-confirmation-description" sx={{ mt: 2 }}>
            {t("editor.are_you_sure", {
              item: selectedForDeletion?.name,
            })}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              {t("editor.delete")}
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={handleCloseModal}
            >
              {t("editor.cancel")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};
