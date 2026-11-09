"use client";

import type { ReactNode } from "react";
import { Component, type ErrorInfo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <Alert variant="destructive" className="rounded-2xl">
            <AlertDescription className="text-sm font-medium">
              Something went wrong with this tool. Please refresh the page.
            </AlertDescription>
          </Alert>
        )
      );
    }

    return this.props.children;
  }
}