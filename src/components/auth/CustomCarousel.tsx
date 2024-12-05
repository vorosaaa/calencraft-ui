import Carousel from "react-material-ui-carousel";

const carouselImages = [
  "/images/barber.webp",
  "/images/fitness.webp",
  "/images/cosmetics.webp",
];

const CarouselCard = ({ src }: { src: string }) => (
  <img
    src={src}
    alt="carousel"
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
);

export const CustomCarousel = () => {
  return (
    <Carousel
      autoPlay={true}
      interval={5000}
      duration={1000}
      animation="slide"
      height={"100vh"}
      indicators={false}
    >
      {carouselImages.map((src, index) => (
        <CarouselCard key={index} src={src} />
      ))}
    </Carousel>
  );
};
