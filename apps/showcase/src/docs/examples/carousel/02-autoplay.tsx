// title: Autoplay with loop
// description: autoPlay advances every N ms. It pauses on hover and focus, shows a pause button, and is switched off for visitors who prefer reduced motion.
import { Carousel, CarouselSlide, Image } from '@sam.barfield/field-react';

export default function CarouselAutoplay() {
  return (
    <Carousel aria-label="Photos of the café" autoPlay={4000} loop className="example-wide" style={{ maxWidth: 640 }}>
      {[1, 2, 3, 4].map(i => (
        <CarouselSlide key={i}>
          <Image src={`https://picsum.photos/seed/field-slide-${i}/1200/675`} alt={`Sample photo ${i}`} ratio={16 / 9} radius="lg" />
        </CarouselSlide>
      ))}
    </Carousel>
  );
}
