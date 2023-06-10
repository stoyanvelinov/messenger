import React from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
// Here we have used react-icons package for the icons
// And react-slick as our Carousel Lib
import Slider from 'react-slick';
import img1 from "../../../assets/LandingImgs/jeferson-santu-_uYxz8BdrhU-unsplash.jpg";
import img2 from "../../../assets/LandingImgs/asterfolio-PjoJga8EovQ-unsplash.jpg";
import img3 from "../../../assets/LandingImgs/chase-chappell-MHIn5uP16cM-unsplash.jpg";
import img4 from "../../../assets/LandingImgs/eugene-chystiakov-cvqvLMVEfBY-unsplash.jpg";

// Settings for the slider
const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function Carousel() {
  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = React.useState(null);

  // These are the breakpoints which changes the position of the
  // buttons as the screen size changes
  const top = useBreakpointValue({ base: '90%', md: '50%' });
  const side = useBreakpointValue({ base: '30%', md: '10px' });

  // These are the images used in the slide
  const cards = [
    img1,img2,img3,img4
  ];

  return (
    <Box
      position={'relative'}
      width={'full'}
      overflow={'hidden'}>
      {/* CSS files for react-slick */}
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      {/* Slider */}
      <Box >

      <Slider {...settings} ref={(slider) => setSlider(slider)} >
        
        {cards.map((url, index) => (
          <img
            key={index}
            // style="relative"
            // backgroundPosition="center"
            // backgroundRepeat="no-repeat"
            // backgroundSize="cover"
            src={url}
          />
        ))}
      </Slider>
      </Box>
    </Box>
  );
}