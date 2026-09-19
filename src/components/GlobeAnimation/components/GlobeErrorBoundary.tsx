import { Component, ErrorInfo, ReactNode } from 'react';

interface GlobeErrorBoundaryType {
  children: ReactNode;
}

interface GlobeErrorBoundaryStateType {
  hasError: boolean;
}

export class GlobeErrorBoundary extends Component<
  GlobeErrorBoundaryType,
  GlobeErrorBoundaryStateType
> {
  state: GlobeErrorBoundaryStateType = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Globe animation failed: ', error, info.componentStack);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}
