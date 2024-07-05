import { Card } from "@mui/material";
import React from "react";
import { Image } from "./Home.css";

type Props = {
  image: string;
  title: string;
};

export const ImageCard = (props: Props) => {
  return (
    <Card>
      <Image {...props} />
    </Card>
  );
};
