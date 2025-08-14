declare module '*.svg' {
  import type * as React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
