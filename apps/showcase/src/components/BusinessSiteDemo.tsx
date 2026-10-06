import React, { useState } from 'react';
import {
  ThemeScope,
  businessThemePairs,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarActions,
  Section,
  Stack,
  Flex,
  Grid,
  Heading,
  Text,
  Button,
  Badge,
  Image,
  Gallery,
  Carousel,
  CarouselSlide,
  Card,
  Avatar,
  Accordion,
  Footer,
  FooterBrand,
  FooterColumn,
  FooterLink,
  FooterBottom,
  Reveal,
  SegmentedControl,
  type ThemeMode,
} from '@sam.barfield/field-react';
import { ArrowRight, Award, Clock, Heart, Leaf, MapPin, Phone, ShieldCheck, Sparkles, Star, Truck, Wrench } from 'lucide-react';

interface SiteContent {
  name: string;
  badge: string;
  headline: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  features: { icon: React.ElementType; title: string; text: string }[];
  galleryTitle: string;
  ctaTitle: string;
  ctaText: string;
  faq: { q: string; a: string }[];
}

const CONTENT: Record<string, SiteContent> = {
  roastery: {
    name: 'Hearth Coffee',
    badge: 'Now open on Sundays',
    headline: 'Small-batch coffee, roasted round the corner',
    lead: 'A neighbourhood café and roastery. Fresh bread from 7am, single-origin coffee all day.',
    primaryCta: 'See the menu',
    secondaryCta: 'Find us',
    features: [
      { icon: Leaf, title: 'Direct-trade beans', text: 'Bought from growers we know, roasted every week.' },
      { icon: Clock, title: 'Baked at dawn', text: 'Sourdough and pastries from our own ovens daily.' },
      { icon: Heart, title: 'Dogs welcome', text: 'Water bowls by the door and treats behind the counter.' },
    ],
    galleryTitle: 'Inside the café',
    ctaTitle: 'Planning a party?',
    ctaText: 'Private hire for up to 40 guests, evenings and weekends.',
    faq: [
      { q: 'Do you take bookings?', a: 'Walk-ins only on weekdays; we take bookings for groups of six or more at weekends.' },
      { q: 'Do you have vegan options?', a: 'Yes, oat milk is free and there are always two vegan bakes.' },
    ],
  },
  workshop: {
    name: 'Brightwell Plumbing',
    badge: 'Gas Safe registered',
    headline: 'Boiler broken? We will be there today.',
    lead: 'Family-run plumbing and heating for over 20 years. Fixed prices, no call-out fee.',
    primaryCta: 'Call 0117 000 0000',
    secondaryCta: 'Get a quote',
    features: [
      { icon: Clock, title: 'Same-day call-outs', text: 'Book before noon for a visit the same day.' },
      { icon: ShieldCheck, title: '12-month guarantee', text: 'Parts and labour covered on every repair.' },
      { icon: Wrench, title: 'All major brands', text: 'Worcester, Vaillant, Baxi, Ideal and more.' },
    ],
    galleryTitle: 'Recent jobs',
    ctaTitle: 'Need a plumber today?',
    ctaText: 'Call before 12pm for a same-day visit.',
    faq: [
      { q: 'Is there a call-out fee?', a: 'No. You only pay for the work, at the price we agree up front.' },
      { q: 'Which areas do you cover?', a: 'All BS postcodes and South Gloucestershire.' },
    ],
  },
  storefront: {
    name: 'Loom & Linen',
    badge: 'Free UK delivery over £50',
    headline: 'Bedding made to last a decade',
    lead: 'Stonewashed linen, woven in Portugal and finished by hand. Softer every wash.',
    primaryCta: 'Shop bedding',
    secondaryCta: 'Our fabrics',
    features: [
      { icon: Truck, title: 'Free returns', text: '100 nights to sleep on it, returns on us.' },
      { icon: Leaf, title: 'European flax', text: 'Grown without irrigation or pesticides.' },
      { icon: Award, title: 'OEKO-TEX certified', text: 'Tested for harmful substances.' },
    ],
    galleryTitle: 'New season colours',
    ctaTitle: '10% off your first order',
    ctaText: 'Join the newsletter for early access to new colours.',
    faq: [
      { q: 'How long does delivery take?', a: 'Two to three working days in the UK.' },
      { q: 'How should I wash linen?', a: 'At 40°C with a mild detergent; tumble dry low or line dry.' },
    ],
  },
  sage: {
    name: 'Stillwater Studio',
    badge: 'New: Sunday restorative class',
    headline: 'Yoga and massage, at your pace',
    lead: 'Small classes and one-to-one treatments in a calm studio by the river.',
    primaryCta: 'Book a class',
    secondaryCta: 'Treatments',
    features: [
      { icon: Sparkles, title: 'Classes for all levels', text: 'Never more than ten people per class.' },
      { icon: Heart, title: 'Qualified therapists', text: 'Sports, deep tissue and pregnancy massage.' },
      { icon: Leaf, title: 'First class free', text: 'Try any class before you buy a pass.' },
    ],
    galleryTitle: 'The studio',
    ctaTitle: 'Give the gift of calm',
    ctaText: 'Gift vouchers for classes and treatments, delivered by email.',
    faq: [
      { q: 'What should I bring?', a: 'Just comfortable clothes. Mats and props are provided.' },
      { q: 'Can I cancel a booking?', a: 'Free cancellation up to 12 hours before your class.' },
    ],
  },
  counsel: {
    name: 'Harrow & Finch',
    badge: 'Established 1987',
    headline: 'Clear legal advice for families and businesses',
    lead: 'Conveyancing, wills and employment law from a team that explains things plainly.',
    primaryCta: 'Book a consultation',
    secondaryCta: 'Our services',
    features: [
      { icon: ShieldCheck, title: 'Fixed-fee quotes', text: 'Know the cost before we start.' },
      { icon: Award, title: 'Lexcel accredited', text: 'The Law Society’s quality mark.' },
      { icon: Clock, title: 'Evening appointments', text: 'Meet us after work, in person or by video.' },
    ],
    galleryTitle: 'Our offices',
    ctaTitle: 'Free 30-minute consultation',
    ctaText: 'Talk through your situation with a qualified solicitor.',
    faq: [
      { q: 'How much does a will cost?', a: 'Single wills from £195 and mirror wills from £295, fixed fee.' },
      { q: 'Do you offer legal aid?', a: 'We do not, but we can refer you to firms that do.' },
    ],
  },
};

const REVIEWS = [
  { name: 'Priya S.', text: 'Couldn’t recommend them more. Friendly, quick and exactly what they promised.' },
  { name: 'Tom R.', text: 'The best local business we have found since moving here.' },
  { name: 'Hannah L.', text: 'Brilliant from the first phone call to the follow-up. Five stars.' },
  { name: 'Marcus O.', text: 'Great value and real attention to detail.' },
];

export const BusinessSiteDemo: React.FC = () => {
  const [pairId, setPairId] = useState(businessThemePairs[0].id);
  const [mode, setMode] = useState<ThemeMode>('light');
  const pair = businessThemePairs.find(p => p.id === pairId) ?? businessThemePairs[0];
  const c = CONTENT[pair.id];
  const photos = Array.from({ length: 6 }, (_, i) => ({
    src: `https://picsum.photos/seed/${pair.id}-${i}/1600/1200`,
    thumbnail: `https://picsum.photos/seed/${pair.id}-${i}/600/450`,
    alt: `Sample photo ${i + 1}`,
  }));

  return (
    <Stack gap="$4">
      <Flex gap="$3" wrap="wrap" align="center" justify="space-between">
        <SegmentedControl
          size="sm"
          aria-label="Website theme"
          value={pairId}
          onChange={setPairId}
          options={businessThemePairs.map(p => ({ value: p.id, label: p.label }))}
        />
        <SegmentedControl<ThemeMode>
          size="sm"
          aria-label="Mode"
          value={mode}
          onChange={setMode}
          options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
        />
      </Flex>

      <ThemeScope themePair={pair} mode={mode} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--field-border-subtle)' }}>
        <Navbar bordered>
          <NavbarBrand>{c.name}</NavbarBrand>
          <NavbarContent align="center" hideOnMobile>
            <NavbarItem isActive>Home</NavbarItem>
            <NavbarItem>About</NavbarItem>
            <NavbarItem>Services</NavbarItem>
            <NavbarItem>Contact</NavbarItem>
          </NavbarContent>
          <NavbarActions>
            <Button size="sm" variant="primary">{c.primaryCta}</Button>
          </NavbarActions>
        </Navbar>

        <Section spacing="lg">
          <Grid columns={{ base: 1, md: 2 }} gap={{ base: '$8', lg: '$16' }} style={{ alignItems: 'center' }}>
            <Stack gap="$5" align="flex-start">
              <Badge variant="accent">{c.badge}</Badge>
              <Heading level={1} display="lg">{c.headline}</Heading>
              <Text size="xl" tone="secondary">{c.lead}</Text>
              <Flex direction={{ base: 'column', sm: 'row' }} gap="$3">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>{c.primaryCta}</Button>
                <Button variant="outline" size="lg">{c.secondaryCta}</Button>
              </Flex>
            </Stack>
            <Image src={`https://picsum.photos/seed/${pair.id}-hero/1000/800`} alt="Sample photo" ratio={5 / 4} radius="xl" loading="eager" />
          </Grid>
        </Section>

        <Section tone="muted">
          <Grid columns={{ base: 1, md: 3 }} gap="$8">
            {c.features.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 120}>
                <Stack gap="$2">
                  <Icon size={24} color="var(--field-accent-primary)" aria-hidden="true" />
                  <Heading level={3}>{title}</Heading>
                  <Text tone="secondary">{text}</Text>
                </Stack>
              </Reveal>
            ))}
          </Grid>
        </Section>

        <Section>
          <Stack gap="$8">
            <Heading level={2} display="sm">{c.galleryTitle}</Heading>
            <Gallery images={photos} columns={{ base: 2, md: 3 }} ratio={4 / 3} />
          </Stack>
        </Section>

        <Section tone="inverse">
          <Stack gap="$8">
            <Heading level={2} display="sm" align="center">Kind words</Heading>
            <Carousel aria-label="Customer reviews" slidesPerView={{ base: 1, md: 2, lg: 3 }}>
              {REVIEWS.map(r => (
                <CarouselSlide key={r.name}>
                  <Card style={{ height: '100%' }}>
                    <Stack gap="$3">
                      <Flex gap={2} role="img" aria-label="5 out of 5 stars">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} size={14} fill="currentColor" color="var(--field-accent-primary)" aria-hidden="true" />
                        ))}
                      </Flex>
                      <Text>“{r.text}”</Text>
                      <Flex align="center" gap="$2">
                        <Avatar name={r.name} size="sm" />
                        <Text size="sm" weight="medium" as="span">{r.name}</Text>
                      </Flex>
                    </Stack>
                  </Card>
                </CarouselSlide>
              ))}
            </Carousel>
          </Stack>
        </Section>

        <Section>
          <Grid columns={{ base: 1, lg: 2 }} gap={{ base: '$8', lg: '$16' }}>
            <Stack gap="$3">
              <Heading level={2} display="sm">Questions</Heading>
              <Text tone="secondary">Can’t find what you need? Give us a call.</Text>
              <Flex align="center" gap="$2"><Phone size={16} aria-hidden="true" /><Text>0117 000 0000</Text></Flex>
              <Flex align="center" gap="$2"><MapPin size={16} aria-hidden="true" /><Text>12 Mill Lane, Bristol</Text></Flex>
            </Stack>
            <Accordion items={c.faq.map((f, i) => ({ id: String(i), title: f.q, content: f.a }))} />
          </Grid>
        </Section>

        <Section tone="accent" spacing="md">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap="$5">
            <Stack gap="$2">
              <Heading level={2} display="sm">{c.ctaTitle}</Heading>
              <Text size="lg" tone="secondary">{c.ctaText}</Text>
            </Stack>
            <Button variant="primary" size="lg">{c.primaryCta}</Button>
          </Flex>
        </Section>

        <Footer>
          <FooterBrand>
            <Heading level={3}>{c.name}</Heading>
            <Text size="sm" tone="secondary">12 Mill Lane, Bristol BS1 4XE</Text>
          </FooterBrand>
          <FooterColumn title="Visit">
            <FooterLink href="#/examples">Opening hours</FooterLink>
            <FooterLink href="#/examples">Directions</FooterLink>
          </FooterColumn>
          <FooterColumn title="Company">
            <FooterLink href="#/examples">About</FooterLink>
            <FooterLink href="#/examples">Contact</FooterLink>
          </FooterColumn>
          <FooterBottom>
            <span>© 2026 {c.name}</span>
            <Flex gap="$4">
              <FooterLink href="#/examples">Privacy</FooterLink>
              <FooterLink href="#/examples">Cookies</FooterLink>
            </Flex>
          </FooterBottom>
        </Footer>
      </ThemeScope>
    </Stack>
  );
};
