import { useTranslation } from "react-i18next";
import { SessionType } from "../../../../types/SessionType";
import { TypeContainer } from "../../../../components/sessionContainer/IconedContainer.css";
import { Avatar, Chip, Typography } from "@mui/material";
import { countries } from "../../../../types/countries";
import { useEffect, useState } from "react";

type Props = {
  session: SessionType;
  style?: React.CSSProperties;
  children: React.ReactNode;
} & React.DOMAttributes<HTMLDivElement>;

export const SessionContainer = ({
  session,
  children,
  style,
  onClick,
}: Props) => {
  const [countryCode, setCountryCode] = useState<string>("");
  const { name, price, currency, lengthInMinutes } = session;
  const { t } = useTranslation();
  useEffect(() => {
    setCountryCode(
      countries.filter((country) => country.currency === currency)[0]?.code,
    );
  }, []);
  return (
    <TypeContainer
      style={{ ...style, paddingTop: 8, paddingBottom: 8 }}
      onClick={onClick}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="body1">{name}</Typography>
        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <Chip
            label={t("profile.firstStep.price_information", {
              price,
              currency,
            })}
            avatar={
              countryCode ? (
                <Avatar
                  sx={{ width: 10, height: 10 }}
                  alt={currency}
                  src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
                />
              ) : undefined
            }
          />
          <Chip
            label={t("profile.firstStep.length_information", {
              minutes: lengthInMinutes,
            })}
          />
        </div>
      </div>
      {children}
    </TypeContainer>
  );
};
