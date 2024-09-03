import { Avatar, Badge, Button } from "@mui/material";
import {
  ContainerOnOverlay,
  Overlay,
  StyledPaper,
} from "./css/ProfileEditor.css";
import { Add, PhotoCamera, PendingOutlined } from "@mui/icons-material";
import { colors } from "../../theme/colors";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pictures } from "../../types/pictures";
import { useMe } from "../../queries/queries";

type Props = {
  pictures: Pictures;
  coverPosition: string;
  setCoverPosition: (position: string) => void;
  handlePictureChange: (
    key: keyof Pictures,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

export const ProfileEditorHeader = ({
  pictures,
  coverPosition,
  setCoverPosition,
  handlePictureChange,
}: Props) => {
  const { cover, profilePicture } = pictures;
  const { data: meData } = useMe();
  const { t } = useTranslation();
  const [dragging, setDragging] = useState(false);
  const [preloadedCoverUrl, setPreloadedCoverUrl] = useState("");

  useEffect(() => {
    if (cover) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreloadedCoverUrl(reader.result as string);
      };
      reader.readAsDataURL(cover);
    }
  }, [cover]);

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
  return (
    <StyledPaper
      elevation={3}
      sx={{
        backgroundImage: `url("${
          cover
            ? preloadedCoverUrl || URL.createObjectURL(cover)
            : meData?.user?.coverUrl
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
            }
          >
            <Avatar
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : meData?.user?.picUrl
              }
              alt="Profile"
              style={{
                width: 100,
                height: 100,
              }}
            />
          </Badge>
        </label>

        <input
          accept="image/*"
          id="profile-picture"
          type="file"
          onChange={(e) => handlePictureChange("profilePicture", e)}
          style={{ display: "none" }}
        />
        <label htmlFor="cover" style={{ cursor: "pointer" }}>
          <Button
            variant="contained"
            component="span"
            startIcon={<PhotoCamera />}
          >
            {t("editor.change_cover")}
          </Button>
        </label>
        <input
          accept="image/*"
          id="cover"
          type="file"
          onChange={(e) => handlePictureChange("cover", e)}
          style={{ display: "none" }}
        />
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
