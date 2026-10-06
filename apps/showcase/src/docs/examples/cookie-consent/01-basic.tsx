// title: Cookie banner
// description: Mount CookieConsent once near the root of your site. It appears until the visitor chooses, saves the choice in localStorage, and useCookieConsent reads it anywhere (e.g. to load analytics) or reopens the preferences from a footer link.
import { useState } from 'react';
import { CookieConsent, useCookieConsent, Button, Flex, Stack, Text, Code, SegmentedControl } from '@sam.barfield/field-react';

// A separate key so this demo doesn't clash with a real banner on the same site.
const STORAGE_KEY = 'field-docs-cookie-demo';

export default function CookieConsentExample() {
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState<'bar' | 'card'>('bar');
  const { consent, openPreferences, reset } = useCookieConsent(STORAGE_KEY);

  return (
    <Stack gap="$4" className="example-col" align="flex-start">
      <SegmentedControl size="sm" aria-label="Layout" value={layout} onChange={setLayout} options={[{ value: 'bar', label: 'bar' }, { value: 'card', label: 'card' }]} />
      <Flex gap="$2" wrap="wrap">
        <Button variant="primary" onClick={() => (mounted ? reset() : setMounted(true))}>Show banner</Button>
        <Button variant="outline" onClick={openPreferences} disabled={!mounted}>Cookie settings</Button>
      </Flex>
      <Text size="sm" tone="secondary">
        Saved choice: <Code>{consent ? JSON.stringify(consent) : 'none yet'}</Code>
      </Text>
      {mounted && <CookieConsent key={layout} storageKey={STORAGE_KEY} layout={layout} policyHref="#/components/cookie-consent" />}
    </Stack>
  );
}
