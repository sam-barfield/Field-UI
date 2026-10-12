// title: Loading, error and empty states
// description: Switch the state to see each one. With onRetry, the default error state offers "Try again".
import { useState } from 'react';
import { AsyncContent, Card, EmptyState, Grid, SegmentedControl, Skeleton, Stack, Text } from '@sam.barfield/field-react';
import { Calendar } from 'lucide-react';

type State = 'loading' | 'error' | 'empty' | 'loaded';

const EVENTS = ['Open day', 'Remembrance service', 'Model aircraft show'];

export default function AsyncContentExample() {
  const [state, setState] = useState<State>('loaded');
  const events = state === 'empty' ? [] : EVENTS;

  return (
    <Stack gap="$4" className="example-wide">
      <SegmentedControl
        aria-label="State"
        value={state}
        onChange={setState}
        options={[
          { value: 'loading', label: 'Loading' },
          { value: 'error', label: 'Error' },
          { value: 'empty', label: 'Empty' },
          { value: 'loaded', label: 'Loaded' },
        ]}
      />
      <AsyncContent
        isLoading={state === 'loading'}
        error={state === 'error' ? new Error('The events feed did not respond.') : undefined}
        isEmpty={events.length === 0}
        onRetry={() => setState('loaded')}
        loadingFallback={
          <Grid columns={{ base: 1, md: 3 }} gap="$4">
            {EVENTS.map(name => <Skeleton key={name} height={96} radius="lg" />)}
          </Grid>
        }
        emptyFallback={<EmptyState variant="plain" icon={<Calendar size={22} />} title="No events planned" description="Check back in the spring." />}
      >
        {() => (
          <Grid columns={{ base: 1, md: 3 }} gap="$4">
            {events.map(name => (
              <Card key={name}>
                <Text weight="semibold">{name}</Text>
              </Card>
            ))}
          </Grid>
        )}
      </AsyncContent>
    </Stack>
  );
}
