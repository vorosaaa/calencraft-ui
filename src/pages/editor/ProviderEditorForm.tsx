import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  SelectChangeEvent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { EmailStatus } from "../../types/enums";
import { ChangeEvent, useState } from "react";
import { AddressAccordionContent } from "./accordions/AddressAccordionContent";
import { ProviderPersonalContent } from "./accordions/ProviderPersonalContent";
import { EmailEditor } from "./emailEditor/EmailEditor";
import { SessionTypeEditorStepper } from "./sessionEditor/SessionEditorStepper";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { useTranslation } from "react-i18next";
import { BreakEditorStepper } from "./breakEditor/BreakEditorStepper";
import { FormState } from "../../types/formState";
import { useNavigate } from "react-router-dom";
import { MoreHoriz } from "@mui/icons-material";

type Props = {
  activeTab: number;
  formData: FormState;
  handleDeleteOpen: () => void;
  setActiveTab: (newValue: number) => void;
  openVerificationModal: () => void;
  handleSubmit: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
};

export const ProviderEditorForm = (props: Props) => {
  const { formData, activeTab, setActiveTab } = props;
  const { t } = useTranslation();
  const isMobile = useCheckMobileScreen();

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <Grid container sx={{ display: "flex", justifyContent: "center" }}>
      <Grid item xs={isMobile ? 12 : 2}>
        <Tabs
          orientation={isMobile ? "horizontal" : "vertical"}
          variant={isMobile ? "scrollable" : "standard"}
          sx={{
            mb: 2,
            borderRight: 1,
            borderColor: "divider",
          }}
          value={activeTab}
          onChange={(event, newValue) => handleTabChange(newValue)}
          indicatorColor="primary"
        >
          <Tab
            sx={{ alignItems: "flex-end" }}
            label={t("editor.personal_information")}
          />
          <Tab sx={{ alignItems: "flex-end" }} label={t("editor.sessions")} />
          <Tab sx={{ alignItems: "flex-end" }} label={t("editor.breaks")} />
          <Tab sx={{ alignItems: "flex-end" }} label={t("editor.email")} />
        </Tabs>
      </Grid>
      <Grid item xs={isMobile ? 12 : 7}>
        {activeTab === 0 && <FormEditor {...props} />}
        {activeTab === 1 && <SessionTypeEditorStepper formState={formData} />}
        {activeTab === 2 && <BreakEditorStepper />}
        {activeTab === 3 && <EmailEditor />}
      </Grid>
    </Grid>
  );
};

const FormEditor = ({
  formData,
  handleDeleteOpen,
  openVerificationModal,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    subscriptionType,
    name,
    description,
    serviceCategory,
    phoneNumber,
    address,
    emailStatus,
  } = formData;
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);
  const handleRemoveAccount = () => {
    handleDeleteOpen();
    handleClose();
  };

  return (
    <Container>
      {subscriptionType && subscriptionType === "NO_SUBSCRIPTION" && (
        <Button
          sx={{ mb: 2 }}
          fullWidth
          variant="outlined"
          color="warning"
          onClick={() => navigate("/myplan")}
        >
          {t("editor.no_plan")}
        </Button>
      )}
      {emailStatus === EmailStatus.NOT_CONFIRMED && (
        <Button
          sx={{ mb: 2 }}
          fullWidth
          variant="outlined"
          color="warning"
          onClick={openVerificationModal}
        >
          {t("editor.verify_email")}
        </Button>
      )}
      <ProviderPersonalContent
        name={name}
        phoneNumber={phoneNumber}
        description={description}
        serviceCategory={serviceCategory}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />
      {address && (
        <Divider variant="middle" sx={{ mb: 4, mt: 4 }}>
          <Typography variant="body2">{t("editor.address")}</Typography>
        </Divider>
      )}
      {address && (
        <AddressAccordionContent
          address={address}
          handleInputChange={handleInputChange}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
        }}
      >
        <Button
          variant="contained"
          sx={{ paddingX: 6 }}
          color="primary"
          onClick={handleSubmit}
        >
          {t("editor.submit")}
        </Button>
        <div>
          <IconButton
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreHoriz />
          </IconButton>
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{
              "& .MuiPaper-root": {
                // Targets the Paper component inside the Menu
                bgcolor: "error.main", // Sets the background color to the theme's error color
                color: "common.white", // Sets the text color to white
              },
            }}
          >
            <MenuItem onClick={handleRemoveAccount}>
              {t("editor.remove")}
            </MenuItem>
          </Menu>
        </div>
      </div>
    </Container>
  );
};
