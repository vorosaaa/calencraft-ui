import { Avatar, Badge, Button, Collapse, Fade } from "@mui/material";
import {
  ContainerOnOverlay,
  Overlay,
  StyledPaper,
} from "./css/ProfileEditor.css";
import { Add, PhotoCamera, PendingOutlined } from "@mui/icons-material";
import { colors } from "../../theme/colors";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  activeTab: number;
  coverPosition: string;
  coverPicture: File | null;
  coverPicUrl: string;
  profilePicUrl: string;
  profilePicture: File | null;
  setCoverPosition: (position: string) => void;
  handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ProfileEditorHeader = ({
  activeTab,
  coverPosition,
  coverPicture,
  coverPicUrl,
  profilePicUrl,
  profilePicture,
  setCoverPosition,
  handleCoverChange,
  handleProfilePictureChange,
}: Props) => {
  const { t } = useTranslation();
  const [dragging, setDragging] = useState(false);
  const [preloadedCoverUrl, setPreloadedCoverUrl] = useState("");

  useEffect(() => {
    if (coverPicture) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreloadedCoverUrl(reader.result as string);
      };
      reader.readAsDataURL(coverPicture);
    }
  }, [coverPicture]);

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (dragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setCoverPosition(`${x}% ${y}%`);
    }
  };
  const isFormEditor = activeTab === 0;
  return (
    <StyledPaper
      elevation={3}
      sx={{
        backgroundImage: `url("${
          coverPicture
            ? preloadedCoverUrl || URL.createObjectURL(coverPicture)
            : coverPicUrl
        }")`,
        backgroundPosition: coverPosition,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <Overlay />
      <ContainerOnOverlay>
        <label htmlFor="profile-picture" style={{ cursor: "pointer" }}>
          <Badge
            sx={{ marginBottom: 2 }}
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Fade in={isFormEditor}>
                <Add
                  fontSize="large"
                  style={{
                    color: colors.white,
                    borderRadius: 50,
                    backgroundColor: "rgba(224,224,224, 0.1)",
                    backdropFilter: "blur(5px)",
                    boxShadow: "none",
                  }}
                />
              </Fade>
            }
          >
            <Avatar
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : profilePicUrl
              }
              alt="Profile"
              style={{
                width: 100,
                height: 100,
              }}
            />
          </Badge>
        </label>

        {isFormEditor && (
          <input
            accept="image/*"
            id="profile-picture"
            type="file"
            onChange={handleProfilePictureChange}
            style={{ display: "none" }}
          />
        )}
        <Collapse in={isFormEditor}>
          <label htmlFor="cover" style={{ cursor: "pointer" }}>
            <Button
              variant="contained"
              component="span"
              startIcon={<PhotoCamera />}
            >
              {t("editor.change_cover")}
            </Button>
          </label>
        </Collapse>
        {isFormEditor && (
          <input
            accept="image/*"
            id="cover"
            type="file"
            onChange={handleCoverChange}
            style={{ display: "none" }}
          />
        )}
      </ContainerOnOverlay>
    </StyledPaper>
  );
};

export const LoadingHeader = () => {
  return (
    <StyledPaper elevation={3} sx={{ backgroundImage: "" }}>
      <Overlay />
      <ContainerOnOverlay>
        <Avatar
          src=""
          alt="Profile"
          style={{
            width: 100,
            height: 100,
            marginBottom: 8,
          }}
        />
        <Button
          disabled
          variant="outlined"
          component="span"
          startIcon={<PendingOutlined />}
        >
          Loading...
        </Button>
      </ContainerOnOverlay>
    </StyledPaper>
  );
};
