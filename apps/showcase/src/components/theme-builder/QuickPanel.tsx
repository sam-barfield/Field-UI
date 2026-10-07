import { useEffect, useState } from 'react';
import { Button, Divider, Flex, Select, Slider, Stack, Switch, Text, TextInput, type FieldThemePair } from '@sam.barfield/field-react';
import { Wand2 } from 'lucide-react';
import { ColorField } from './ColorField';
import { fontStack, firstFamily, GOOGLE_FONTS, loadGoogleFont } from './fonts';
import { deriveAccent, generateNeutrals } from './generate';
import { mapModes, type Draft, type Mode } from './model';

interface PanelProps {
  draft: Draft;
  update: (fn: (d: Draft) => Draft, coalesce?: boolean) => void;
}

const setPair = (fn: (pair: FieldThemePair) => FieldThemePair) => (d: Draft): Draft => ({ ...d, pair: fn(d.pair) });

function Group({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Stack gap="$3" as="section" className="tb-group">
      <Stack gap="$1">
        <Text weight="semibold">{title}</Text>
        {hint && (
          <Text size="xs" tone="secondary">
            {hint}
          </Text>
        )}
      </Stack>
      {children}
    </Stack>
  );
}

/** Brand colour, neutrals, shape and type: the decisions that define most of a theme. */
export function QuickPanel({ draft, update }: PanelProps) {
  const { pair } = draft;
  const [linked, setLinked] = useState(pair.light.semantics.accent.primary === pair.dark.semantics.accent.primary);
  const [neutralHue, setNeutralHue] = useState(220);
  const [neutralTint, setNeutralTint] = useState(8);

  const fonts = pair.light.fonts ?? {};
  const typography = pair.light.typography ?? {};
  const radius = parseInt(pair.light.radiiOverrides?.md ?? '8px', 10);

  useEffect(() => {
    [fonts.display, fonts.sans].forEach(stack => loadGoogleFont(firstFamily(stack)));
  }, [fonts.display, fonts.sans]);

  const setBrand = (mode: Mode, color: string) =>
    update(
      setPair(p => {
        const modes: Mode[] = linked ? ['light', 'dark'] : [mode];
        return mapModes(p, (theme, m) =>
          modes.includes(m)
            ? {
                ...theme,
                semantics: { ...theme.semantics, accent: deriveAccent(color, m, theme.semantics.surfaces) },
              }
            : theme
        );
      })
    );

  const applyNeutrals = (hue: number, tint: number) =>
    update(
      setPair(p =>
        mapModes(p, (theme, m) => {
          const generated = generateNeutrals(hue, tint, m, theme.semantics.borders.focus);
          const semantics = { ...theme.semantics, ...generated };
          // Re-derive the accent so its text tint still passes on the new surfaces.
          return { ...theme, semantics: { ...semantics, accent: { ...deriveAccent(semantics.accent.primary, m, semantics.surfaces), ...pickManual(theme.semantics.accent) } } };
        })
      )
    );

  const setShared = (patch: Partial<Pick<FieldThemePair['light'], 'fonts' | 'radiiOverrides' | 'typography'>>) =>
    update(setPair(p => mapModes(p, theme => ({ ...theme, ...patch }))));

  const fontOptions = [{ value: '', label: 'Field default (Inter)' }, ...GOOGLE_FONTS.map(f => ({ value: f.family, label: f.family }))];
  const setFont = (slot: 'display' | 'sans', family: string) => {
    if (family) loadGoogleFont(family);
    const next = { ...fonts };
    if (family) next[slot] = fontStack(family);
    else delete next[slot];
    setShared({ fonts: next });
  };

  return (
    <Stack gap="$5">
      <Group title="Brand colour" hint="Sets the whole accent group: hover and active states, tints, button text, and a lighter text tint wherever the brand colour is too dark to read as text.">
        <Switch label="Same colour in both modes" checked={linked} onChange={setLinked} size="sm" />
        <Flex gap="$3" wrap="wrap">
          <div className="tb-flex-field">
            <ColorField label={linked ? 'Brand' : 'Light mode'} value={pair.light.semantics.accent.primary} onChange={v => v && setBrand('light', v)} />
          </div>
          {!linked && (
            <div className="tb-flex-field">
              <ColorField label="Dark mode" value={pair.dark.semantics.accent.primary} onChange={v => v && setBrand('dark', v)} />
            </div>
          )}
        </Flex>
      </Group>

      <Divider />

      <Group title="Neutrals" hint="Generates surfaces, text and borders for both modes, tinted towards one hue. Text tiers are kept at 4.5:1 or better.">
        <Flex gap="$3" align="center">
          <span className="tb-hue-preview" style={{ background: `hsl(${neutralHue} ${Math.min(60, neutralTint * 3)}% 50%)` }} aria-hidden="true" />
          <div className="tb-flex-field">
            <Slider label="Hue" min={0} max={359} value={neutralHue} onChange={setNeutralHue} valueSuffix="°" />
          </div>
        </Flex>
        <Slider label="Tint" min={0} max={30} value={neutralTint} onChange={setNeutralTint} valueSuffix="%" />
        <Button variant="secondary" size="sm" leftIcon={<Wand2 size={14} />} onClick={() => applyNeutrals(neutralHue, neutralTint)}>
          Generate neutrals
        </Button>
      </Group>

      <Divider />

      <Group title="Shape">
        <Slider
          label="Corner radius"
          min={0}
          max={20}
          value={Number.isNaN(radius) ? 8 : radius}
          valueSuffix="px"
          onChange={r =>
            setShared({
              radiiOverrides: {
                xs: `${Math.max(r ? 1 : 0, Math.round(r * 0.4))}px`,
                sm: `${Math.round(r * 0.7)}px`,
                md: `${r}px`,
                lg: `${Math.round(r * 1.5)}px`,
                xl: `${Math.round(r * 2)}px`,
              },
            })
          }
        />
      </Group>

      <Divider />

      <Group title="Type" hint="Fonts load from Google Fonts for this preview only. In a site, self-host them (see the Installation guide).">
        <Select label="Headings" value={firstFamily(fonts.display)} options={fontOptions} onChange={v => setFont('display', v)} />
        <Select label="Body and controls" value={firstFamily(fonts.sans)} options={fontOptions} onChange={v => setFont('sans', v)} />
        <TextInput
          label="Other Google Font"
          placeholder="e.g. Barlow"
          helperText="Loads at regular weight only; press Enter to use it for headings."
          onKeyDown={e => {
            const value = (e.target as HTMLInputElement).value.trim();
            if (e.key === 'Enter' && value) setFont('display', value);
          }}
        />
        <Slider label="Display weight" min={500} max={900} step={50} value={typography.displayWeight ?? 700} onChange={v => setShared({ typography: { ...typography, displayWeight: v } })} />
        <Slider label="Heading weight" min={400} max={800} step={50} value={typography.headingWeight ?? 600} onChange={v => setShared({ typography: { ...typography, headingWeight: v } })} />
        <Slider
          label="Heading tightness"
          min={0}
          max={20}
          value={Math.round((typography.headingTracking ?? 1) * 10)}
          onChange={v => setShared({ typography: { ...typography, headingTracking: v / 10 } })}
          valueSuffix=" / 10"
        />
        <Text size="xs" tone="secondary">
          Tightness scales Field's negative letter-spacing: 10 is the default, 0 removes it. Wide grotesques often look better around 5.
        </Text>
      </Group>

      <Divider />

      <Group title="Photo bands" hint="Photo sections and inverse bands on a light page use the dark theme. Give them their own theme when they need different tokens, e.g. the true brand colour where dark mode uses a lighter tint.">
        <Switch
          size="sm"
          label="Separate band theme"
          checked={!!pair.band}
          onChange={on =>
            update(
              setPair(p => {
                if (!on) {
                  const { band: _removed, ...rest } = p;
                  return rest;
                }
                return { ...p, band: { ...structuredClone(p.dark), id: `${p.id}-band`, label: `${p.label} Band` } };
              }),
              false
            )
          }
        />
        {pair.band && (
          <Text size="xs" tone="secondary">
            Edit it in the Tokens tab with the Band mode selected.
          </Text>
        )}
      </Group>
    </Stack>
  );
}

/** Accent tokens that should survive neutral regeneration (only text is re-derived). */
function pickManual(accent: FieldThemePair['light']['semantics']['accent']) {
  const { text: _text, ...rest } = accent;
  return rest;
}
