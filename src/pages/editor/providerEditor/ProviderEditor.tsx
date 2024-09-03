import React, { ChangeEvent, useState } from "react";
import { SelectChangeEvent, Grid, Tab, Tabs } from "@mui/material";
import { FormState } from "../../../types/formState";
import { GeneralEditor } from "./GeneralEditor";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../../hooks/screenHook";
import { SessionTypeEditorStepper } from "../sessionEditor/SessionEditorStepper";
import { BreakEditorStepper } from "../breakEditor/BreakEditorStepper";
import { EmailEditor } from "../emailEditor/EmailEditor";
import { Pictures } from "../../../types/pictures";

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Grid
      container
      sx={{ display: "flex", minHeight: "100vh", justifyContent: "center" }}
    >
      <Grid item xs={isMobile ? 12 : 2}>
        <Tabs
          orientation={isMobile ? "horizontal" : "vertical"}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            height: "100%",
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
        </Tabs>
      </Grid>
      <Grid
        item
        xs={isMobile ? 12 : 10}
        sx={{ overflowY: "auto", maxHeight: "100vh" }}
      >
        {activeTab === 0 && <GeneralEditor {...props} />}
        {activeTab === 1 && <SessionTypeEditorStepper formState={formData} />}
        {activeTab === 2 && <BreakEditorStepper />}
        {activeTab === 3 && <EmailEditor />}
      </Grid>
    </Grid>
  );
};
