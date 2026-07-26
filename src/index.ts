/** Aborts when the first input aborts and preserves that signal's reason. */
export function abortSignalAny(signals: readonly AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  const alreadyAborted = signals.find((signal) => signal.aborted);
  if (alreadyAborted !== undefined) {
    controller.abort(alreadyAborted.reason);
    return controller.signal;
  }

  const listeners = new Map<AbortSignal, () => void>();
  function cleanup(): void {
    listeners.forEach((listener, signal) => {
      signal.removeEventListener("abort", listener);
    });
    listeners.clear();
  }

  signals.forEach((signal) => {
    const listener = (): void => {
      cleanup();
      controller.abort(signal.reason);
    };
    listeners.set(signal, listener);
    signal.addEventListener("abort", listener, { once: true });
  });
  return controller.signal;
}
