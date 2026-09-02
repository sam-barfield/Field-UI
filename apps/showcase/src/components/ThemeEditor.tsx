import { useState } from 'react';
import {
  useTheme,
  themePresets,
  themeToCssString,
  themeToDtcgJson,
  themeToTypeScript,
  Button,
  Card,
  CardHeader,
  CardContent,
  Slider,
  Heading,
  Text,
  useToast,
} from '@field/react';
import { Copy, Download, Sparkles, Sliders, Code2, Palette } from 'lucide-react';

export const ThemeEditor: React.FC = () => {
  const { theme, setTheme, updateThemeSemantics, setMode } = useTheme();
  const { showToast } = useToast();
  const [exportFormat, setExportFormat] = useState<'css' | 'dtcg' | 'ts'>('css');

  // Accent swatches with primary, hover, and active states
  const accentSwatches = [
    { label: 'Field Cobalt', value: '#2563EB', hover: '#3B82F6', active: '#1D4ED8' },
    { label: 'Tactical Amber', value: '#D97706', hover: '#F59E0B', active: '#B45309' },
    { label: 'Cyber Emerald', value: '#10B981', hover: '#34D399', active: '#059669' },
    { label: 'Deep Violet', value: '#7C3AED', hover: '#8B5CF6', active: '#6D28D9' },
    { label: 'Signal Crimson', value: '#DC2626', hover: '#EF4444', active: '#B91C1C' },
    { label: 'Aerospace Cyan', value: '#0891B2', hover: '#06B6D4', active: '#0E7490' },
  ];

  // Neutral undertone presets
  const neutralPresets = [
    { label: 'Obsidian Deep', base: '#090B0E', raised: '#11141B', overlay: '#171B24' },
    { label: 'Neutral Zinc', base: '#09090B', raised: '#18181B', overlay: '#27272A' },
    { label: 'Slate Oceanic', base: '#020617', raised: '#0F172A', overlay: '#1E293B' },
    { label: 'Graphite Warm', base: '#0D0D0D', raised: '#161616', overlay: '#242424' },
  ];

  const handleAccentChange = (primary: string, hover?: string, active?: string) => {
    const hoverColor = hover || primary;
    const activeColor = active || hover || primary;
    updateThemeSemantics(prev => ({
      ...prev,
      semantics: {
        ...prev.semantics,
        accent: {
          ...prev.semantics.accent,
          primary,
          hover: hoverColor,
          active: activeColor,
          subtle: `${primary}24`,
          subtleHover: `${primary}38`,
        },
        borders: {
          ...prev.semantics.borders,
          focus: primary,
        },
      },
    }));
  };

  const handleNeutralChange = (neutral: typeof neutralPresets[0]) => {
    updateThemeSemantics(prev => ({
      ...prev,
      semantics: {
        ...prev.semantics,
        surfaces: {
          ...prev.semantics.surfaces,
          base: neutral.base,
          raised: neutral.raised,
          overlay: neutral.overlay,
        },
      },
    }));
  };

  const handleRadiusChange = (radiusPx: number) => {
    updateThemeSemantics(prev => ({
      ...prev,
      radiiOverrides: {
        xs: `${Math.max(1, Math.round(radiusPx * 0.4))}px`,
        sm: `${Math.max(2, Math.round(radiusPx * 0.7))}px`,
        md: `${radiusPx}px`,
        lg: `${Math.round(radiusPx * 1.5)}px`,
        xl: `${Math.round(radiusPx * 2)}px`,
      },
    }));
  };

  const currentRadius = parseInt(theme.radiiOverrides?.md || '8px', 10);

  const getExportCode = () => {
    switch (exportFormat) {
      case 'css':
        return themeToCssString(theme);
      case 'dtcg':
        return themeToDtcgJson(theme);
      case 'ts':
        return themeToTypeScript(theme);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getExportCode());
    showToast({
      title: 'Tokens Copied to Clipboard',
      description: `Exported ${exportFormat.toUpperCase()} config for "${theme.label}"`,
      variant: 'success',
    });
  };

  const handleDownloadFile = () => {
    const code = getExportCode();
    const filename =
      exportFormat === 'css'
        ? 'field-tokens.css'
        : exportFormat === 'dtcg'
        ? 'tokens.json'
        : 'fieldTheme.ts';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      title: 'File Downloaded',
      description: `Saved ${filename} to your device`,
      variant: 'success',
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '24px' }}>
      {/* Controls Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={18} style={{ color: 'var(--field-accent-primary)' }} />
              <Heading level={3}>Theme Presets</Heading>
            </div>
            <Text tone="secondary" size="xs" style={{ marginTop: '4px' }}>
              Select a handcrafted baseline or customize every parameter.
            </Text>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {themePresets.map(preset => {
                const isSelected = theme.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setTheme(preset);
                      setMode(preset.mode);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--field-radius-md)',
                      background: isSelected ? 'var(--field-surface-active)' : 'var(--field-surface-sunken)',
                      border: `1px solid ${isSelected ? 'var(--field-accent-primary)' : 'var(--field-border-subtle)'}`,
                      color: 'var(--field-text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{preset.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--field-text-secondary)', textTransform: 'capitalize' }}>
                        {preset.mode} mode
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: preset.semantics.surfaces.base,
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}
                      />
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: preset.semantics.accent.primary,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Accent Color Customizer */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: 'var(--field-accent-primary)' }} />
              <Heading level={4}>Accent Spectrum</Heading>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {accentSwatches.map(swatch => {
                const isActive = theme.semantics.accent.primary.toLowerCase() === swatch.value.toLowerCase();
                return (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => handleAccentChange(swatch.value, swatch.hover, swatch.active)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 4px',
                      borderRadius: 'var(--field-radius-sm)',
                      background: isActive ? 'var(--field-surface-active)' : 'transparent',
                      border: `1px solid ${isActive ? swatch.value : 'var(--field-border-subtle)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: swatch.value,
                        boxShadow: isActive ? `0 0 10px ${swatch.value}` : 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--field-text-secondary)', textAlign: 'center' }}>
                      {swatch.label.split(' ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '0.8125rem', color: 'var(--field-text-secondary)' }}>Custom Hex:</label>
              <input
                type="color"
                value={theme.semantics.accent.primary}
                onChange={e => handleAccentChange(e.target.value, e.target.value)}
                style={{
                  width: '38px',
                  height: '32px',
                  border: '1px solid var(--field-border-default)',
                  borderRadius: 'var(--field-radius-xs)',
                  cursor: 'pointer',
                  background: 'transparent',
                }}
              />
              <span style={{ fontFamily: 'var(--field-font-mono)', fontSize: '0.8125rem' }}>
                {theme.semantics.accent.primary}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tactile & Geometric Controls */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} style={{ color: 'var(--field-accent-primary)' }} />
              <Heading level={4}>Geometry & Surfaces</Heading>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Text size="xs" tone="secondary" style={{ marginBottom: '8px' }}>
                  Neutral Undertone
                </Text>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  {neutralPresets.map(n => (
                    <button
                      key={n.label}
                      type="button"
                      onClick={() => handleNeutralChange(n)}
                      style={{
                        padding: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        borderRadius: 'var(--field-radius-sm)',
                        backgroundColor: 'var(--field-surface-sunken)',
                        border: '1px solid var(--field-border-subtle)',
                        color: 'var(--field-text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>

              <Slider
                label="Corner Radius (Scale)"
                value={currentRadius}
                min={0}
                max={20}
                step={1}
                valueSuffix="px"
                onChange={handleRadiusChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Export & Live Output Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code2 size={18} style={{ color: 'var(--field-accent-primary)' }} />
                <Heading level={3}>Design Token Code Export</Heading>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button size="sm" variant="secondary" leftIcon={<Copy size={14} />} onClick={handleCopyCode}>
                  Copy
                </Button>
                <Button size="sm" variant="primary" leftIcon={<Download size={14} />} onClick={handleDownloadFile}>
                  Download
                </Button>
              </div>
            </div>
            <Text tone="secondary" size="xs" style={{ marginTop: '4px' }}>
              Instantly export your live tokens to CSS variables, W3C DTCG JSON, or TypeScript format.
            </Text>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <Button
                size="sm"
                variant={exportFormat === 'css' ? 'primary' : 'outline'}
                onClick={() => setExportFormat('css')}
              >
                CSS Variables (:root)
              </Button>
              <Button
                size="sm"
                variant={exportFormat === 'dtcg' ? 'primary' : 'outline'}
                onClick={() => setExportFormat('dtcg')}
              >
                W3C DTCG Tokens (JSON)
              </Button>
              <Button
                size="sm"
                variant={exportFormat === 'ts' ? 'primary' : 'outline'}
                onClick={() => setExportFormat('ts')}
              >
                TypeScript Config
              </Button>
            </div>

            <div
              style={{
                position: 'relative',
                maxHeight: '480px',
                overflowY: 'auto',
                backgroundColor: 'var(--field-surface-sunken)',
                border: '1px solid var(--field-border-default)',
                borderRadius: 'var(--field-radius-md)',
                padding: '16px',
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontFamily: 'var(--field-font-mono)',
                  fontSize: '0.8125rem',
                  color: 'var(--field-text-primary)',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {getExportCode()}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
