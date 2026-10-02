import { Component, type ErrorInfo, type ReactNode } from 'react';
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }
  render() {
    return this.state.error ? (
      <div className="fatal">
        <span className="eyebrow">Erro inesperado</span>
        <h1>Não foi possível abrir esta página.</h1>
        <p>Recarregue a aplicação para tentar novamente.</p>
        <button className="button primary" onClick={() => location.reload()}>
          Recarregar
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
