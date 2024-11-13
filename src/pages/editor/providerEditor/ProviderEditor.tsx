import React, { ChangeEvent, useState } from "react";
import { SelectChangeEvent, Tab, Tabs, Box } from "@mui/material";
import { FormState } from "../../../types/formState";
import { GeneralEditor } from "./GeneralEditor";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../../hooks/screenHook";
import { SessionTypeEditorStepper } from "../sessionEditor/SessionEditorStepper";
import { BreakEditorStepper } from "../breakEditor/BreakEditorStepper";
import { EmailEditor } from "../emailEditor/EmailEditor";
import { Pictures } from "../../../types/pictures";
import { ClientEditor } from "../clientEditor/ClientEditor";

type Props = {
  formData: FormState;
  pictureData: Pictures;
  setFormData: (value: React.SetStateAction<FormState | undefined>) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
  setCoverPosition: (position: string) => void;
  handleSubmit: () => void;
  handlePictureChange: (
    key: keyof Pictures,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

export const ProviderEditor = (props: Props) => {
  const { formData } = props;
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();
  const isMobile = useCheckMobileScreen();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    window.scrollTo(0, 0);
  };

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      minHeight="100vh"
    >
      <Box
        sx={{
          width: isMobile ? "100%" : "240px",
          borderRight: isMobile ? "none" : 1,
          borderColor: "divider",
          overflowY: "auto",
        }}
      >
        <Tabs
          orientation={isMobile ? "horizontal" : "vertical"}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderRight: isMobile ? "none" : 1,
            borderColor: "divider",
          }}
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
        >
          <Tab label={t("editor.personal_information")} />
          <Tab label={t("editor.sessions")} />
          <Tab label={t("editor.breaks")} />
          <Tab label={t("editor.email")} />
          <Tab label={t("editor.clients")} />
        </Tabs>
      </Box>
      <Box flexGrow={1}>
        {activeTab === 0 && <GeneralEditor {...props} />}
        {activeTab === 1 && <SessionTypeEditorStepper formState={formData} />}
        {activeTab === 2 && <BreakEditorStepper />}
        {activeTab === 3 && <EmailEditor />}
        {activeTab === 4 && <ClientEditor />}
      </Box>
    </Box>
  );
};
