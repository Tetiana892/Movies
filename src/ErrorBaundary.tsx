import { Component, ErrorInfo, PropsWithChildren } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<PropsWithChildren<any>, ErrorBoundaryState> {
  constructor(props: PropsWithChildren<any>) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    alert(error);
  }

  static getDerivedStateError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Oops! Something went wrong...</h2>;
    }
    return this.props.children;
  }
}
