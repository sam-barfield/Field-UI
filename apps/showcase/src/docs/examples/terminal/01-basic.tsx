// title: Interactive terminal
// description: Type help, status or clear. Use ↑ / ↓ for history.
import { useState } from 'react';
import { Terminal, TerminalHeader, TerminalBody, TerminalLine, TerminalPrompt, type LogLevel } from '@sam.barfield/field-react';

interface Line { id: number; level: LogLevel; text: string; time: string }

const now = () => new Date().toLocaleTimeString([], { hour12: false });
let nextId = 3;

export default function TerminalBasic() {
  const [lines, setLines] = useState<Line[]>([
    { id: 1, level: 'info', text: 'Connected to cluster prod-eu-1', time: now() },
    { id: 2, level: 'success', text: '6/6 pods ready', time: now() },
  ]);

  const run = (cmd: string) => {
    if (cmd === 'clear') return setLines([]);
    const reply: Line =
      cmd === 'status'
        ? { id: nextId++, level: 'success', text: 'All systems operational', time: now() }
        : cmd === 'help'
          ? { id: nextId++, level: 'info', text: 'Commands: help, status, clear', time: now() }
          : { id: nextId++, level: 'error', text: `command not found: ${cmd}`, time: now() };
    setLines(l => [...l, { id: nextId++, level: 'cmd', text: `$ ${cmd}`, time: now() }, reply]);
  };

  return (
    <div className="example-wide">
      <Terminal height={300}>
        <TerminalHeader title="ops@prod-eu-1: ~" onClear={() => setLines([])} onCopyAll={() => navigator.clipboard?.writeText(lines.map(l => l.text).join('\n'))} />
        <TerminalBody>
          {lines.map(l => (
            <TerminalLine key={l.id} level={l.level} timestamp={l.time}>
              {l.text}
            </TerminalLine>
          ))}
        </TerminalBody>
        <TerminalPrompt user="ops" path="~" onSubmit={run} placeholder="Type help…" />
      </Terminal>
    </div>
  );
}
