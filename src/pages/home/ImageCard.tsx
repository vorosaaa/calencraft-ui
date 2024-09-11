import { Card, CardMedia } from "@mui/material";

type Props = {
  image: string;
  title: string;
};

export const ImageCard = (props: Props) => {
  return (
    <Card>
      <CardMedia sx={{ height: 360, objectFit: "cover" }} {...props} />
    </Card>
  );
};
