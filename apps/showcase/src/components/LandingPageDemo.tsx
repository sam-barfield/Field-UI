import React, { useState } from 'react';
import {
  UnfoldingHeading,
  UnfoldingSpeed,
  UnfoldingIntensity,
  Button,
  Badge,
  Card,
  CardHeader,
  CardContent,
  StatCard,
  Flex,
  Stack,
  Grid,
  Text,
  SegmentedControl,
} from '@sam.barfield/field-react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowDown,
  Box,
  Code2,
} from 'lucide-react';

const WIREFRAME_COLORS = [
  { label: 'Cyan', value: '#00d2ff', bg: '#00d2ff' },
  { label: 'Emerald', value: '#10b981', bg: '#10b981' },
  { label: 'Violet', value: '#a855f7', bg: '#a855f7' },
  { label: 'Amber', value: '#f59e0b', bg: '#f59e0b' },
  { label: 'White', value: '#f8fafc', bg: '#f8fafc' },
];

export const LandingPageDemo: React.FC = () => {
  const [wireframeColor, setWireframeColor] = useState<string>('#00d2ff');
  const [speed, setSpeed] = useState<UnfoldingSpeed>('normal');
  const [intensity, setIntensity] = useState<UnfoldingIntensity>('subtle');
  const [replayKey, setReplayKey] = useState<number>(0);

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
  };

  return (
    <div
      key={replayKey}
      style={{
        width: '100%',
        minHeight: '100%',
        paddingBottom: '120px',
        color: 'var(--field-text-primary)',
      }}
    >
      {/* Sticky Interactive Demo Control Bar */}
      <div
        style={{
          position: 'sticky',
          top: '72px',
          zIndex: 50,
          backgroundColor: 'rgba(15, 18, 24, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--field-border-subtle)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          borderRadius: 'var(--field-radius-md)',
          marginBottom: '40px',
        }}
      >
        <Flex align="center" gap="12px">
          <Badge variant="accent" dot>
            Scroll Trigger Active
          </Badge>
          <Text size="sm" tone="secondary">
            Scroll down to watch subheadings unfold in real-time as they enter viewport
          </Text>
        </Flex>

        <Flex align="center" gap="16px" wrap="wrap">
          {/* Wireframe Color Swatches */}
          <Flex align="center" gap="8px">
            <Text size="xs" tone="secondary" weight="medium">
              WIREFRAME:
            </Text>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {WIREFRAME_COLORS.map((c) => {
                const isSelected = wireframeColor === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => setWireframeColor(c.value)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: c.bg,
                      border: isSelected
                        ? '2px solid #ffffff'
                        : '1px solid rgba(255,255,255,0.2)',
                      boxShadow: isSelected
                        ? `0 0 10px ${c.value}`
                        : 'none',
                      cursor: 'pointer',
                      outline: 'none',
                      padding: 0,
                      transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.15s ease',
                    }}
                  />
                );
              })}
            </div>
          </Flex>

          {/* Speed Preset Selector */}
          <Flex align="center" gap="8px">
            <Text size="xs" tone="secondary" weight="medium">
              SPEED:
            </Text>
            <SegmentedControl
              size="sm"
              value={speed}
              onChange={(val) => setSpeed(val as UnfoldingSpeed)}
              options={[
                { value: 'fast', label: 'Fast' },
                { value: 'normal', label: 'Normal' },
                { value: 'slow', label: 'Slow' },
                { value: 'cinematic', label: 'Cinematic' },
              ]}
            />
          </Flex>

          {/* Visual Intensity Selector */}
          <Flex align="center" gap="8px">
            <Text size="xs" tone="secondary" weight="medium">
              BRIGHTNESS:
            </Text>
            <SegmentedControl
              size="sm"
              value={intensity}
              onChange={(val) => setIntensity(val as UnfoldingIntensity)}
              options={[
                { value: 'subtle', label: 'Subtle' },
                { value: 'medium', label: 'Medium' },
                { value: 'vibrant', label: 'Vibrant' },
              ]}
            />
          </Flex>

          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RotateCcw size={14} />}
            onClick={handleReplay}
          >
            Replay All
          </Button>
        </Flex>
      </div>

      {/* =========================================================================
          HERO SECTION (trigger="mount")
          ========================================================================= */}
      <section
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px 20px',
          borderBottom: '1px solid var(--field-border-subtle)',
          position: 'relative',
        }}
      >
        {/* Subtle decorative grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 50% 30%, rgba(0, 210, 255, 0.08), transparent 70%), linear-gradient(var(--field-border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--field-border-subtle) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 48px 48px, 48px 48px',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '880px' }}>
          <Flex justify="center" style={{ marginBottom: '16px' }}>
            <Badge variant="default" dot>
              FIELD DESIGN SYSTEM v0.2.6
            </Badge>
          </Flex>

          {/* Hero Heading: Unfolds automatically on Mount */}
          <div style={{ margin: '16px 0 28px' }}>
            <UnfoldingHeading
              as="h1"
              size="hero"
              text="WE CRAFT DIGITAL EXPERIENCES"
              highlightWords={['CRAFT', 'EXPERIENCES']}
              highlightColor="#2563eb"
              intensity={intensity}
              trigger="mount"
              wireframeColor={wireframeColor}
              speed={speed}
            />
          </div>

          <Text size="lg" tone="secondary" style={{ maxWidth: '640px', margin: '0 auto 32px' }}>
            Polygonal wireframe meshes assembled triangle-by-triangle in calligraphic stroke order,
            with a trailing materialization wave that solidifies into the precision styled typeface.
          </Text>

          <Flex justify="center" gap="16px" wrap="wrap">
            <Button size="lg" variant="primary" leftIcon={<Sparkles size={16} />}>
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftIcon={<ArrowDown size={16} />}
              onClick={() => {
                const el = document.getElementById('section-architecture');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Scroll to Sections
            </Button>
          </Flex>

          {/* Key metrics / stats */}
          <Grid columns={3} gap="16px" style={{ marginTop: '56px' }}>
            <StatCard
              label="Zero Extra Dependencies"
              value="0 KB"
              subtitle="Pure SVG vector dilation & CSS GPU compositing"
            />
            <StatCard
              label="Render Performance"
              value="120 FPS"
              subtitle="Hardware-accelerated opacity dissolves with 0% resting CPU"
            />
            <StatCard
              label="Accessibility"
              value="100%"
              subtitle="Semantic heading tags & prefers-reduced-motion support"
            />
          </Grid>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: ARCHITECTURE (trigger="scroll")
          ========================================================================= */}
      <section
        id="section-architecture"
        style={{
          padding: '100px 24px',
          borderBottom: '1px solid var(--field-border-subtle)',
        }}
      >
        <Stack gap="32px">
          <div>
            <Badge variant="accent" style={{ marginBottom: '12px' }}>
              SECTION 01
            </Badge>
            <div>
              <UnfoldingHeading
                as="h2"
                size="lg"
                text="01 / ARCHITECTURE"
                intensity={intensity}
                trigger="scroll"
                wireframeColor={wireframeColor}
                speed={speed}
              />
            </div>
            <Text size="base" tone="secondary" style={{ marginTop: '8px' }}>
              This section heading triggered its wireframe unfold when it entered the viewport.
            </Text>
          </div>

          <Grid columns={3} gap="24px">
            <Card>
              <CardHeader>
                <div>
                  <Text size="base" weight="semibold">Silhouette Vector Dilation</Text>
                  <Text size="xs" tone="secondary">Zero overlapping box frame seams</Text>
                </div>
              </CardHeader>
              <CardContent>
                <Flex align="center" gap="12px" style={{ marginBottom: '12px' }}>
                  <Box size={24} style={{ color: 'var(--field-border-focus)' }} />
                  <Text size="sm" weight="semibold">
                    Unified Typographic Mask
                  </Text>
                </Flex>
                <Text size="sm" tone="secondary">
                  Uses SVG dilation and exclusion filters to trace the exact outer perimeter of the
                  typeface, eliminating internal box joints on letters like A, E, F, and H.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <Text size="base" weight="semibold">Calligraphic Stroke Order</Text>
                  <Text size="xs" tone="secondary">Sequential top-down facet assembly</Text>
                </div>
              </CardHeader>
              <CardContent>
                <Flex align="center" gap="12px" style={{ marginBottom: '12px' }}>
                  <Cpu size={24} style={{ color: 'var(--field-accent-primary)' }} />
                  <Text size="sm" weight="semibold">
                    Sequential Wireframe Drafting
                  </Text>
                </Flex>
                <Text size="sm" tone="secondary">
                  Letters assemble facet-by-facet following their natural pen stroke paths, followed
                  by a trailing wave that solidifies completed wireframe characters into styled typography.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <Text size="base" weight="semibold">Dual-Layer Zero-Flash</Text>
                  <Text size="xs" tone="secondary">Synchronized color crossfading</Text>
                </div>
              </CardHeader>
              <CardContent>
                <Flex align="center" gap="12px" style={{ marginBottom: '12px' }}>
                  <Zap size={24} style={{ color: 'var(--field-status-warning-base)' }} />
                  <Text size="sm" weight="semibold">
                    Native Color Preservation
                  </Text>
                </Flex>
                <Text size="sm" tone="secondary">
                  Highlighted words like <code>CRAFT</code> and <code>EXPERIENCES</code> fade in with
                  native brand colors from frame 0, with zero white flashing or abrupt snaps.
                </Text>
              </CardContent>
            </Card>
          </Grid>
        </Stack>
      </section>

      {/* =========================================================================
          SECTION 2: CALLIGRAPHIC DRAFTING (trigger="scroll")
          ========================================================================= */}
      <section
        id="section-nets"
        style={{
          padding: '100px 24px',
          borderBottom: '1px solid var(--field-border-subtle)',
        }}
      >
        <Stack gap="32px">
          <div>
            <Badge variant="accent" style={{ marginBottom: '12px' }}>
              SECTION 02
            </Badge>
            <div>
              <UnfoldingHeading
                as="h2"
                size="lg"
                text="02 / CALLIGRAPHIC PRECISION"
                intensity={intensity}
                trigger="scroll"
                wireframeColor={wireframeColor}
                speed={speed}
              />
            </div>
            <Text size="base" tone="secondary" style={{ marginTop: '8px' }}>
              Letterforms draft in natural pen-stroke order, followed by a trailing wave that solidifies into styled typography.
            </Text>
          </div>

          <Grid columns={2} gap="24px">
            <Card style={{ backgroundColor: 'var(--field-surface-raised)' }}>
              <CardHeader>
                <div>
                  <Text size="base" weight="semibold">Top-Down Stroke Sequencing</Text>
                  <Text size="xs" tone="secondary">Authentic typographical stroke directions</Text>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="12px">
                  <Text size="sm" tone="secondary">
                    Letters unfold facet-by-facet following real pen-stroke order. Stems start at the top
                    and descend, diagonals route to interior valleys, and crossbars resolve last.
                  </Text>
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--field-surface-sunken)',
                      borderRadius: 'var(--field-radius-sm)',
                      border: '1px solid var(--field-border-subtle)',
                    }}
                  >
                    <UnfoldingHeading
                      as="h3"
                      size="md"
                      text="CALLIGRAPHY"
                      intensity={intensity}
                      trigger="scroll"
                      wireframeColor={wireframeColor}
                      speed={speed}
                    />
                  </div>
                </Stack>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: 'var(--field-surface-raised)' }}>
              <CardHeader>
                <div>
                  <Text size="base" weight="semibold">Trailing Materialization Wave</Text>
                  <Text size="xs" tone="secondary">Zero-flash native color crossfade</Text>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="12px">
                  <Text size="sm" tone="secondary">
                    The leading wireframe wave drafts ahead while trailing letters dissolve their wireframe
                    mesh and smoothly crossfade into final styled typography with zero white flashes.
                  </Text>
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--field-surface-sunken)',
                      borderRadius: 'var(--field-radius-sm)',
                      border: '1px solid var(--field-border-subtle)',
                    }}
                  >
                    <UnfoldingHeading
                      as="h3"
                      size="md"
                      text="MATERIALISE"
                      highlightWords={['MATERIALISE']}
                      highlightColor="#2563eb"
                      intensity={intensity}
                      trigger="scroll"
                      wireframeColor={wireframeColor}
                      speed={speed}
                    />
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Stack>
      </section>

      {/* =========================================================================
          SECTION 3: TACTILE CRAFT (trigger="scroll")
          ========================================================================= */}
      <section
        id="section-tactile"
        style={{
          padding: '100px 24px',
          borderBottom: '1px solid var(--field-border-subtle)',
        }}
      >
        <Stack gap="32px">
          <div>
            <Badge variant="accent" style={{ marginBottom: '12px' }}>
              SECTION 03
            </Badge>
            <div>
              <UnfoldingHeading
                as="h2"
                size="lg"
                text="03 / TACTILE CRAFT"
                intensity={intensity}
                trigger="scroll"
                wireframeColor={wireframeColor}
                speed={speed}
              />
            </div>
            <Text size="base" tone="secondary" style={{ marginTop: '8px' }}>
              Subtle drafting watermark, calibrated facet folds, and zero-flash fusion to solid typography.
            </Text>
          </div>

          <Grid columns={3} gap="24px">
            <Card>
              <CardContent style={{ paddingTop: '20px' }}>
                <Flex align="center" gap="12px" style={{ marginBottom: '12px' }}>
                  <Layers size={20} style={{ color: 'var(--field-accent-primary)' }} />
                  <Text size="base" weight="semibold">
                    Tunable Intensity Modes
                  </Text>
                </Flex>
                <Text size="sm" tone="secondary">
                  Choose between <code>subtle</code> (42% stroke watermark, zero bloom), <code>medium</code>,
                  and <code>vibrant</code> brightness presets to complement light and dark backgrounds.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardContent style={{ paddingTop: '20px' }}>
                <Flex align="center" gap="12px" style={{ marginBottom: '12px' }}>
                  <ShieldCheck size={20} style={{ color: 'var(--field-status-success-base)' }} />
                  <Text size="base" weight="semibold">
                    Accessibility Built-In
                  </Text>
                </Flex>
                <Text size="sm" tone="secondary">
                  Under the hood, a real semantic <code>&lt;h1&gt;</code> to <code>&lt;h4&gt;</code>{' '}
                  tag is rendered for screen readers, search engines, and full copy-paste support.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardContent style={{ paddingTop: '20px' }}>
                <Flex align="center" gap="12px" style={{ marginBottom: '12px' }}>
                  <Code2 size={20} style={{ color: 'var(--field-border-focus)' }} />
                  <Text size="base" weight="semibold">
                    IntersectionObserver
                  </Text>
                </Flex>
                <Text size="sm" tone="secondary">
                  Hardware-efficient observation: stops all loops once resting so there is 0% CPU
                  utilization when idle.
                </Text>
              </CardContent>
            </Card>
          </Grid>
        </Stack>
      </section>

      {/* =========================================================================
          CALL TO ACTION SECTION (trigger="scroll")
          ========================================================================= */}
      <section
        style={{
          padding: '100px 24px 40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '48px 32px',
            backgroundColor: 'var(--field-surface-raised)',
            border: '1px solid var(--field-border-strong)',
            borderRadius: 'var(--field-radius-lg)',
            boxShadow: 'var(--field-shadow-lg)',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <UnfoldingHeading
              as="h2"
              size="md"
              text="READY FOR FIELD"
              intensity={intensity}
              trigger="scroll"
              wireframeColor={wireframeColor}
              speed={speed}
            />
          </div>

          <Text size="base" tone="secondary" style={{ marginBottom: '24px' }}>
            Add <code>&lt;UnfoldingHeading /&gt;</code> to any section header or hero title with a
            single line of code.
          </Text>

          <Flex justify="center" gap="12px">
            <Button size="md" variant="primary">
              Copy Component Code
            </Button>
            <Button size="md" variant="secondary" onClick={handleReplay}>
              Replay Landing Page
            </Button>
          </Flex>
        </div>
      </section>
    </div>
  );
};
