import type { ASTDocument } from '@ecosyt/ast';

export interface CompileResult {
  files: Record<string, string>;
  errors: string[];
}

export function compile(document: ASTDocument): CompileResult {
  return {
    files: {
      'src/App.tsx': `export function App() { return <div>${document.documentId}</div>; }`,
    },
    errors: [],
  };
}
