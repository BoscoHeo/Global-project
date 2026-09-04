import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary caught an error]:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (_) {}
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <AlertTriangle className="w-7 h-7 text-amber-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-black text-white">화면을 불러오는 중 일시적인 오류가 발생했습니다</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                클라우드 동기화 또는 데이터 로딩 중 문제가 생겼을 수 있습니다.<br />
                아래 버튼을 눌러 새로고침하거나 캐시를 초기화해 보세요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>페이지 새로고침</span>
              </button>

              <button
                onClick={this.handleResetCacheAndReload}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>캐시 비우고 첫 화면으로</span>
              </button>
            </div>

            {this.state.error && (
              <details className="text-left bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono overflow-auto max-h-36">
                <summary className="cursor-pointer text-amber-400 font-bold mb-1">
                  기술적 오류 상세 (선생님 확인용)
                </summary>
                <p className="text-rose-400 font-bold">{this.state.error.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-1 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
