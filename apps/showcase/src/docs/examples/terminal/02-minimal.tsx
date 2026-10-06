// title: Minimal embedded console
// description: variant="minimal" drops the window chrome, level badges and submit button for embedding in a web console. Every part is optional: omit TerminalHeader or TerminalPrompt entirely, or opt pieces back in with showControls, showBadge and showSubmitButton.
import { useState } from 'react';
import { Terminal, TerminalHeader, TerminalBody, TerminalLine, TerminalPrompt, type LogLevel } from '@sam.barfield/field-react';

interface Line { id: number; level: LogLevel; text: string }

let nextId = 3;

export default function TerminalMinimal() {
  const [lines, setLines] = useState<Line[]>([
    { id: 1, level: 'debug', text: 'Attached to web-7f9c (us-east-1)' },
    { id: 2, level: 'info', text: 'Type help for commands.' },
  ]);

  const run = (cmd: string) => {
    if (cmd === 'clear') return setLines([]);
    const reply: Line =
      cmd === 'help'
        ? { id: nextId++, level: 'info', text: 'Commands: help, uptime, clear' }
        : cmd === 'uptime'
          ? { id: nextId++, level: 'success', text: 'up 12 days, 4:07, load average: 0.18' }
          : { id: nextId++, level: 'error', text: `command not found: ${cmd}` };
    setLines(l => [...l, { id: nextId++, level: 'cmd', text: `> ${cmd}` }, reply]);
  };

  return (
    <div className="example-wide">
      <Terminal variant="minimal" height={220}>
        <TerminalHeader title="Console" onClear={() => setLines([])} />
        <TerminalBody>
          {lines.map(l => (
            <TerminalLine key={l.id} level={l.level}>
              {l.text}
            </TerminalLine>
          ))}
        </TerminalBody>
        <TerminalPrompt prompt=">" onSubmit={run} placeholder="Run a command" />
      </Terminal>
    </div>
  );
}
