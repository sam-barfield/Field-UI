// title: Customer reviews
// description: slidesPerView takes a breakpoint object: one review on phones, two from 768px, three from 1024px. Swipe, use the arrows or the dots.
import { Carousel, CarouselSlide, Card, Stack, Flex, Text, Avatar } from '@sam.barfield/field-react';
import { Star } from 'lucide-react';

const REVIEWS = [
  { name: 'Priya S.', text: 'Best flat white in the city, and the cardamom buns sell out for a reason.' },
  { name: 'Tom R.', text: 'Booked the back room for a team breakfast. Faultless from start to finish.' },
  { name: 'Hannah L.', text: 'Friendly staff, dog-friendly, and the sourdough is worth the queue.' },
  { name: 'Marcus O.', text: 'They made our wedding cake at two weeks notice. Still dreaming about it.' },
  { name: 'Aisha K.', text: 'My go-to for working mornings. Good wifi, better coffee.' },
];

export default function CarouselReviews() {
  return (
    <Carousel aria-label="Customer reviews" slidesPerView={{ base: 1, md: 2, lg: 3 }} className="example-wide">
      {REVIEWS.map(review => (
        <CarouselSlide key={review.name}>
          <Card style={{ height: '100%' }}>
            <figure style={{ margin: 0 }}>
              <Stack gap="$3">
                <Flex gap={2} aria-label="5 out of 5 stars" role="img">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={14} fill="currentColor" color="var(--field-accent-primary)" aria-hidden="true" />
                  ))}
                </Flex>
                <blockquote style={{ margin: 0 }}>
                  <Text>“{review.text}”</Text>
                </blockquote>
                <Flex as="figcaption" align="center" gap="$2">
                  <Avatar name={review.name} size="sm" />
                  <Text size="sm" weight="medium" as="span">{review.name}</Text>
                </Flex>
              </Stack>
            </figure>
          </Card>
        </CarouselSlide>
      ))}
    </Carousel>
  );
}
