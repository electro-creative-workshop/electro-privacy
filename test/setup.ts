import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

declare global {
  interface Window {
    [key: string]: unknown;
    OnetrustActiveGroups?: string;
    OptanonActiveGroups?: string;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

afterEach(() => {
  cleanup();
});
