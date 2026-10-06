'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { mergeClassNames } from '../utils/polymorphic.js';
import { getPortalTarget, usePortalThemeProps } from '../theme/usePortalTheme.js';
import { Button } from './Button.js';
import { Switch } from './Controls.js';
import { Link } from './Website.js';

export interface CookieCategory {
  /** Key stored in the consent record, e.g. `analytics`. */
  id: string;
  label: string;
  description?: React.ReactNode;
  /** Always on and cannot be switched off (strictly necessary cookies). */
  required?: boolean;
  /** Initial state in the preferences panel. Default `false`. */
  defaultEnabled?: boolean;
}

/** Consent per category id, e.g. `{ necessary: true, analytics: false }`. */
export type CookieConsentRecord = Record<string, boolean>;

interface StoredConsent {
  version: string;
  consent: CookieConsentRecord;
  updatedAt: string;
}

const DEFAULT_STORAGE_KEY = 'field-cookie-consent';
const CONSENT_EVENT = 'field-cookie-consent';

type ConsentEventDetail = { storageKey: string; action: 'updated' | 'open' | 'reset' };

const DEFAULT_CATEGORIES: CookieCategory[] = [
  { id: 'necessary', label: 'Strictly necessary', description: 'Required for the site to work, e.g. remembering this choice.', required: true },
  { id: 'analytics', label: 'Analytics', description: 'Helps us understand how visitors use the site.' },
  { id: 'marketing', label: 'Marketing', description: 'Used to show relevant adverts on other sites.' },
];

function readStored(storageKey: string): StoredConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as StoredConsent) : null;
  } catch {
    return null;
  }
}

function dispatchConsentEvent(detail: ConsentEventDetail) {
  window.dispatchEvent(new CustomEvent<ConsentEventDetail>(CONSENT_EVENT, { detail }));
}

/**
 * Read the visitor's saved cookie choices anywhere in the app, and reopen the
 * preferences panel (e.g. from a "Cookie settings" footer link).
 *
 * @example
 * const { consent, openPreferences } = useCookieConsent();
 * useEffect(() => { if (consent?.analytics) loadAnalytics(); }, [consent?.analytics]);
 */
export function useCookieConsent(storageKey: string = DEFAULT_STORAGE_KEY) {
  const [stored, setStored] = useState<StoredConsent | null>(null);

  useEffect(() => {
    const sync = () => setStored(readStored(storageKey));
    sync();
    const onEvent = (e: Event) => {
      if ((e as CustomEvent<ConsentEventDetail>).detail?.storageKey === storageKey) sync();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) sync();
    };
    window.addEventListener(CONSENT_EVENT, onEvent);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onEvent);
      window.removeEventListener('storage', onStorage);
    };
  }, [storageKey]);

  const openPreferences = useCallback(() => dispatchConsentEvent({ storageKey, action: 'open' }), [storageKey]);
  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* storage unavailable */
    }
    dispatchConsentEvent({ storageKey, action: 'updated' });
    dispatchConsentEvent({ storageKey, action: 'reset' });
  }, [storageKey]);

  return {
    /** Saved choices, or `null` until the visitor has decided. */
    consent: stored?.consent ?? null,
    /** True once the visitor allowed this category. */
    hasConsent: (categoryId: string) => !!stored?.consent[categoryId],
    /** Reopen the banner with the preferences panel expanded. */
    openPreferences,
    /** Forget the saved choices and ask again. */
    reset,
  };
}

export interface CookieConsentProps {
  /** Cookie categories. Default: necessary (required), analytics, marketing. */
  categories?: CookieCategory[];
  /** Banner heading. Default `We use cookies`. */
  title?: React.ReactNode;
  /** Banner text. */
  description?: React.ReactNode;
  /** Link to your cookie or privacy policy. */
  policyHref?: string;
  /** Default `Cookie policy`. */
  policyLabel?: string;
  /** localStorage key for the saved choices. Default `field-cookie-consent`. */
  storageKey?: string;
  /** Bump this when your categories change to ask everyone again. Default `1`. */
  version?: string;
  /** `bar` spans the bottom of the screen; `card` floats in a corner. Default `bar`. */
  layout?: 'bar' | 'card';
  /** Called with the choices whenever the visitor saves them. */
  onChange?: (consent: CookieConsentRecord) => void;
  acceptLabel?: string;
  rejectLabel?: string;
  customizeLabel?: string;
  saveLabel?: string;
  className?: string;
}

/**
 * Cookie consent banner with accept all / reject non-essential / customise.
 * Choices are saved in localStorage and exposed through `useCookieConsent`.
 * Reject is as prominent as accept, and nothing optional is enabled by default,
 * in line with GDPR / PECR guidance. Only load non-essential scripts once
 * `consent[category]` is true.
 *
 * @example
 * <CookieConsent policyHref="/cookies" onChange={c => c.analytics && loadAnalytics()} />
 */
export const CookieConsent: React.FC<CookieConsentProps> = ({
  categories = DEFAULT_CATEGORIES,
  title = 'We use cookies',
  description = 'We use essential cookies to make this site work, and optional cookies to understand how it is used. You can choose which optional cookies to allow.',
  policyHref,
  policyLabel = 'Cookie policy',
  storageKey = DEFAULT_STORAGE_KEY,
  version = '1',
  layout = 'bar',
  onChange,
  acceptLabel = 'Accept all',
  rejectLabel = 'Reject non-essential',
  customizeLabel = 'Customise',
  saveLabel = 'Save preferences',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [choices, setChoices] = useState<CookieConsentRecord>({});
  const titleId = React.useId();
  const descriptionId = React.useId();
  const portalProps = usePortalThemeProps(mergeClassNames('field-cookie-consent', `field-cookie-consent-${layout}`, className));

  const initialChoices = useCallback(
    (saved?: CookieConsentRecord) =>
      Object.fromEntries(categories.map(c => [c.id, c.required ? true : saved?.[c.id] ?? c.defaultEnabled ?? false])),
    [categories]
  );

  // Decide after mount (never during SSR) whether to ask.
  useEffect(() => {
    const stored = readStored(storageKey);
    setChoices(initialChoices(stored?.consent));
    if (!stored || stored.version !== version) setOpen(true);

    const onEvent = (e: Event) => {
      const detail = (e as CustomEvent<ConsentEventDetail>).detail;
      if (detail?.storageKey !== storageKey || detail.action === 'updated') return;
      setChoices(initialChoices(readStored(storageKey)?.consent));
      setCustomizing(detail.action === 'open');
      setOpen(true);
    };
    window.addEventListener(CONSENT_EVENT, onEvent);
    return () => window.removeEventListener(CONSENT_EVENT, onEvent);
  }, [storageKey, version, initialChoices]);

  const save = (consent: CookieConsentRecord) => {
    const record: StoredConsent = { version, consent, updatedAt: new Date().toISOString() };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(record));
    } catch {
      /* storage unavailable: keep the choice for this page view only */
    }
    setOpen(false);
    setCustomizing(false);
    dispatchConsentEvent({ storageKey, action: 'updated' });
    onChange?.(consent);
  };

  const allWith = (value: boolean) => Object.fromEntries(categories.map(c => [c.id, c.required ? true : value]));

  if (!open) return null;
  const target = getPortalTarget();
  if (!target) return null;

  return createPortal(
    <div {...portalProps}>
      <div className="field-cookie-consent-panel" role="dialog" aria-modal="false" aria-labelledby={titleId} aria-describedby={descriptionId}>
        <div className="field-cookie-consent-body">
          <h2 id={titleId} className="field-cookie-consent-title">
            {title}
          </h2>
          <p id={descriptionId} className="field-cookie-consent-text">
            {description}
            {policyHref && (
              <>
                {' '}
                <Link href={policyHref}>{policyLabel}</Link>
              </>
            )}
          </p>
          {customizing && (
            <div className="field-cookie-consent-categories">
              {categories.map(category => (
                <Switch
                  key={category.id}
                  size="sm"
                  label={category.label}
                  description={category.description}
                  checked={!!choices[category.id]}
                  disabled={category.required}
                  onChange={checked => setChoices(prev => ({ ...prev, [category.id]: checked }))}
                />
              ))}
            </div>
          )}
        </div>
        <div className="field-cookie-consent-actions">
          {customizing ? (
            <Button variant="primary" size="sm" onClick={() => save(choices)}>
              {saveLabel}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setCustomizing(true)}>
              {customizeLabel}
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => save(allWith(false))}>
            {rejectLabel}
          </Button>
          <Button variant={customizing ? 'secondary' : 'primary'} size="sm" onClick={() => save(allWith(true))}>
            {acceptLabel}
          </Button>
        </div>
      </div>
    </div>,
    target
  );
};
