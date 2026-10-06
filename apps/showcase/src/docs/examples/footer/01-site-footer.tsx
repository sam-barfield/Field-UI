// title: Site footer
// description: FooterBrand takes the wide first column; FooterColumns that only contain FooterLinks become labelled link lists; FooterBottom holds copyright and legal links. Columns wrap on small screens.
import { Footer, FooterBrand, FooterColumn, FooterLink, FooterBottom, Heading, Text, Flex, IconButton } from '@sam.barfield/field-react';
import { Instagram, Facebook, Mail } from 'lucide-react';

export default function SiteFooter() {
  return (
    <div className="example-site">
      <Footer>
        <FooterBrand>
          <Heading level={3}>Hearth Bakery</Heading>
          <Text size="sm" tone="secondary">
            12 Mill Lane, Bristol BS1 4XE
            <br />
            Open daily 7am – 4pm
          </Text>
          <Flex gap="$1">
            <IconButton as="a" href="https://instagram.com" variant="ghost" size="sm" icon={<Instagram size={16} />} aria-label="Instagram" />
            <IconButton as="a" href="https://facebook.com" variant="ghost" size="sm" icon={<Facebook size={16} />} aria-label="Facebook" />
            <IconButton as="a" href="mailto:hello@hearth.example" variant="ghost" size="sm" icon={<Mail size={16} />} aria-label="Email us" />
          </Flex>
        </FooterBrand>
        <FooterColumn title="Visit">
          <FooterLink href="#/components/footer">Menu</FooterLink>
          <FooterLink href="#/components/footer">Opening hours</FooterLink>
          <FooterLink href="https://maps.google.com" external>Directions</FooterLink>
        </FooterColumn>
        <FooterColumn title="Order">
          <FooterLink href="#/components/footer">Celebration cakes</FooterLink>
          <FooterLink href="#/components/footer">Wholesale</FooterLink>
          <FooterLink href="#/components/footer">Gift cards</FooterLink>
        </FooterColumn>
        <FooterColumn title="About">
          <FooterLink href="#/components/footer">Our story</FooterLink>
          <FooterLink href="#/components/footer">Jobs</FooterLink>
          <FooterLink href="#/components/footer">Contact</FooterLink>
        </FooterColumn>
        <FooterBottom>
          <span>© 2026 Hearth Bakery Ltd</span>
          <Flex gap="$4" wrap="wrap">
            <FooterLink href="#/components/footer">Privacy</FooterLink>
            <FooterLink href="#/components/footer">Terms</FooterLink>
            <FooterLink href="#/components/footer">Cookies</FooterLink>
          </Flex>
        </FooterBottom>
      </Footer>
    </div>
  );
}
