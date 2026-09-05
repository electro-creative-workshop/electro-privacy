import type * as React from 'react';
type GtmComponentProps = {
    gtmId: string;
};
export type GtmConsentGateProps = {
    gtmId: string;
    gaMeasurementIds?: readonly string[];
    performanceCode?: string;
    GoogleTagManager: React.ComponentType<GtmComponentProps>;
};
export declare const browserNavigation: {
    reload(): void;
};
export declare function GtmConsentGate({ gtmId, gaMeasurementIds, performanceCode, GoogleTagManager, }: GtmConsentGateProps): React.ReactElement | null;
export {};
//# sourceMappingURL=gtm-consent-gate.d.ts.map