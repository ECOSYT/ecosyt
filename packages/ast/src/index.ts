import { randomUUID } from 'node:crypto';
import type { NodeID, SchemaVersion } from '@ecosyt/shared';

export interface ASTDocument {
  documentId: string;
  rootId: NodeID;
  schemaVersion: SchemaVersion;
}

export function createDocument(documentId: string): ASTDocument {
  return {
    documentId,
    rootId: randomUUID(),
    schemaVersion: '1.0.0',
  };
}
