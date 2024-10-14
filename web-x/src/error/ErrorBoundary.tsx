import React from "react";
import SomethingWentWrong from "./SomethingWentWrong";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    reloadOnReset?: boolean;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

    public state: ErrorBoundaryState = {
        hasError: false,
        error: new Error()
    };

    public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true, error: _ };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log(error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (<SomethingWentWrong
                error={this.state.error}
                resetErrorBoundary={this.resetErrorBoundary}
            />);
        }

        return this.props.children;
    }

    resetErrorBoundary = () => {

        this.setState({
            hasError: false,
            error: new Error()
        });

        if (this.props.reloadOnReset) {
            window.location.reload();
        }

    }

}

export default ErrorBoundary;