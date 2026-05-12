import { describe, expect, it } from 'vitest';
import { createDocument } from '../../packages/ast/src/index.ts';
import { compile } from '../../packages/compiler/src/index.ts';
import { createRuntime } from '../../packages/runtime/src/index.ts';
import { createYDocument } from '../../packages/sync/src/index.ts';

describe('core smoke', () => {
  it('creates an AST document with stable schema version', () => {
    const document = createDocument('doc-1');

    expect(document.documentId).toBe('doc-1');
    expect(document.rootId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(document.schemaVersion).toBe('1.0.0');
  });

  it('compiles to an App.tsx file', () => {
    const output = compile(createDocument('project-a'));

    expect(output.errors).toEqual([]);
    expect(output.files['src/App.tsx']).toContain('project-a');
  });

  it('mounts runtime marker on provided container', () => {
    const runtime = createRuntime();
    const container = {
      setAttribute: (name: string, value: string) => {
        if (name === 'data-runtime') {
          (container as { runtimeState?: string }).runtimeState = value;
        }
      },
    };

    runtime.mount(container);

    expect((container as { runtimeState?: string }).runtimeState).toBe('mounted');
  });

  it('creates a Yjs document', () => {
    const yDocument = createYDocument();

    expect(typeof yDocument.clientID).toBe('number');
  });
});
