import React, { useState } from 'react';
import {
  UnfoldingHeading,
  UnfoldingVariant,
  UnfoldingSpeed,
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
  const [variant, setVariant] = useState<UnfoldingVariant>('faceted');
  const [wireframeColor, setWireframeColor] = useState<string>('#00d2ff');
  const [speed, setSpeed] = useState<UnfoldingSpeed>('normal');
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

          {/* Fold Style */}
          <Flex align="center" gap="8px">
            <Text size="xs" tone="secondary" weight="medium">
              STYLE:
            </Text>
            <SegmentedControl
              size="sm"
              value={variant}
              onChange={(val) => setVariant(val as UnfoldingVariant)}
              options={[
                { value: 'modular', label: 'Scorecard Net' },
                { value: 'faceted', label: 'Faceted Origami' },
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
              FIELD DESIGN SYSTEM v0.2.4
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
              variant={variant}
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
              subtitle="Internal Rodrigues 3D solver without heavy WebGL bloat"
            />
            <StatCard
              label="Render Performance"
              value="120 FPS"
              subtitle="Micro-batch canvas with retina DPR scaling"
            />
            <StatCard
              label="Accessibility"
              value="100%"
              subtitle="Screen reader headings & reduced-motion fallbacks"
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
                variant={variant}
                trigger="scroll"
                wireframeColor={wireframeColor}
                speed={speed}
              />
            </div>
            <Text size="base" tone="secondary" style={{ marginTop: '8px' }}>
              This section heading triggered its 3D wireframe unfold when it entered the viewport.
            </Text>
          </div>

          <Grid columns={3} gap="24px">
            <Card>
              <CardHeader>
                <div>
                  <Text size="base" weight="semibold">Hinge Kinematics</Text>
                  <Text size="xs" tone="secondary">Rigid planar folding along shared edges</Text>
                </div>
              </CardHeader>
              <CardContent>
                <Flex align="center" gap="12px" style={{ marginBottom: '12px' }}>
                  <Box size={24} style={{ color: 'var(--field-border-focus)' }} />
                  <Text size="sm" weight="semibold">
                    Rodrigues Rotation Formula
                  </Text>
                </Flex>
                <Text size="sm" tone="secondary">
                  Each character is decomposed into an adjacency tree of polygonal plates. Child
                  facets rotate around the 3D unit vector of the hinge line connecting them to their
                  parent.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <Text size="base" weight="semibold">Micro Projection Engine</Text>
                  <Text size="xs" tone="secondary">Zero WebGL runtime overhead</Text>
                </div>
              </CardHeader>
              <CardContent>
                <Flex align="center" gap="12px" style={{ marginBottom: '12px' }}>
                  <Cpu size={24} style={{ color: 'var(--field-accent-primary)' }} />
                  <Text size="sm" weight="semibold">
                    Lightweight Vector Engine
                  </Text>
                </Flex>
                <Text size="sm" tone="secondary">
                  No Three.js or Babylon.js required. The entire 3D calculation runs in under 4KB of
                  pure TypeScript math, executing inside a standard 2D canvas context.
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <Text size="base" weight="semibold">Theme Integration</Text>
                  <Text size="xs" tone="secondary">Synchronized with Field design tokens</Text>
                </div>
              </CardHeader>
              <CardContent>
                <Flex align="center" gap="12px" style={{ marginBottom: '12px' }}>
                  <Zap size={24} style={{ color: 'var(--field-status-warning-base)' }} />
                  <Text size="sm" weight="semibold">
                    Dynamic Color Mapping
                  </Text>
                </Flex>
                <Text size="sm" tone="secondary">
                  Wireframe hairline edges automatically pull from <code>--field-border-focus</code> and
                  solid text fills resolve smoothly to <code>--field-text-primary</code>.
                </Text>
              </CardContent>
            </Card>
          </Grid>
        </Stack>
      </section>

      {/* =========================================================================
          SECTION 2: MODULAR NETS (trigger="scroll")
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
                text="02 / MODULAR NETS"
                variant={variant}
                trigger="scroll"
                wireframeColor={wireframeColor}
                speed={speed}
              />
            </div>
            <Text size="base" tone="secondary" style={{ marginTop: '8px' }}>
              Notice how the letterforms start as folded wireframe prisms and unfold flat on scroll.
            </Text>
          </div>

          <Grid columns={2} gap="24px">
            <Card style={{ backgroundColor: 'var(--field-surface-raised)' }}>
              <CardHeader>
                <div>
                  <Text size="base" weight="semibold">Modular Box Net Variant</Text>
                  <Text size="xs" tone="secondary">Architectural plates with 90° box-fold seams</Text>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="12px">
                  <Text size="sm" tone="secondary">
                    Inspired by cardboard carton packaging nets and technical drafting. Characters
                    are built from rectangular and chamfered facets that wrap into compact 3D blocks
                    and unfold flat like architectural blueprints.
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
                      text="BOX NET"
                      variant="modular"
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
                  <Text size="base" weight="semibold">Faceted Origami Variant</Text>
                  <Text size="xs" tone="secondary">Triangulated low-poly mesh lattice</Text>
                </div>
              </CardHeader>
              <CardContent>
                <Stack gap="12px">
                  <Text size="sm" tone="secondary">
                    Decomposes character silhouettes into connected triangular meshes with
                    alternating mountain and valley fold angles. Collapses into crystalline shards
                    and uncreases into smooth typography.
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
                      text="ORIGAMI"
                      variant="faceted"
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
                variant={variant}
                trigger="scroll"
                wireframeColor={wireframeColor}
                speed={speed}
              />
            </div>
            <Text size="base" tone="secondary" style={{ marginTop: '8px' }}>
              Blueprint node anchors, edge glow, and seamless fusion to solid typography.
            </Text>
          </div>

          <Grid columns={3} gap="24px">
            <Card>
              <CardContent style={{ paddingTop: '20px' }}>
                <Flex align="center" gap="12px" style={{ marginBottom: '12px' }}>
                  <Layers size={20} style={{ color: 'var(--field-accent-primary)' }} />
                  <Text size="base" weight="semibold">
                    Hairline Edge Glow
                  </Text>
                </Flex>
                <Text size="sm" tone="secondary">
                  Wireframe edges feature subtle cyan/accent bloom during motion, giving the
                  tactile feeling of an illuminated HUD or laser-scribed cad model.
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
              variant={variant}
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
