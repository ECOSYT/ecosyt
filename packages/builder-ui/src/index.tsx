import type { ReactNode } from 'react';

export function BuilderShell({ children }: { children: ReactNode }) {
  return <section>{children}</section>;
}
