import { Box } from '@chakra-ui/react';
import Slider from 'react-slick';
import img1 from '../../../assets/LandingImgs/jeferson-santu-_uYxz8BdrhU-unsplash.jpg';
import img2 from '../../../assets/LandingImgs/asterfolio-PjoJga8EovQ-unsplash.jpg';
import img3 from '../../../assets/LandingImgs/chase-chappell-MHIn5uP16cM-unsplash.jpg';
import img4 from '../../../assets/LandingImgs/eugene-chystiakov-cvqvLMVEfBY-unsplash.jpg';

// Settings for the slider
const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 3000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function Carousel() {

  // These are the images used in the slide
  const cards = [
    img1,img2,img3,img4
  ];

  return (
    <Box
      position='relative'
      width='full'
      overflow='hidden'>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <Box >
      <Slider {...settings}  >
        {cards.map((url, index) => (
          <img
            key={index}
            src={url}
          />
        ))}
      </Slider>
      </Box>
    </Box>
  );
}