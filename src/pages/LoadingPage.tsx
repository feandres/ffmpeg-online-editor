const t = {
  loading: "Carregando FFmpeg...",
  initializing: "Inicializando core WebAssembly. Aguarde.",
  error: "Ocorreu um erro ao carregar.",
  tryAgain: "Tentar novamente",
  spinnerAlt: "Carregando...",
};

type Props = {
  error: string | null;
  onRetry?: () => void;
};

// Spinner reutilizável
function Spinner() {
  return (
    <div
      role="status"
      aria-label={t.spinnerAlt}
      className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin flex items-center justify-center"
    >
      <span className="sr-only">{t.spinnerAlt}</span>
    </div>
  );
}

export default function LoadingPage({ error, onRetry }: Props) {
  return (
    <main className="flex h-screen items-center justify-center">
      <section className="rounded-2xl shadow p-6 border max-w-sm w-full" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <h2 className="text-lg font-medium">{t.loading}</h2>
          <p className="text-sm text-gray-600">{t.initializing}</p>
          {error && (
            <div
              className="w-full bg-red-100 text-red-700 p-2 rounded text-sm flex flex-col items-center"
              role="alert"
            >
              <span>{error || t.error}</span>
              {onRetry && (
                <button
                  className="mt-2 px-3 py-1 rounded bg-red-200 hover:bg-red-300 text-red-800 text-xs font-semibold transition"
                  onClick={onRetry}
                  aria-label={t.tryAgain}
                  type="button"
                >
                  {t.tryAgain}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}