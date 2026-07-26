import { describe, expect, it, vi } from "vitest";

import { abortSignalAny } from "../src/index.js";

describe("abortSignalAny", () => {
  it("returns a live signal for empty input", () => {
    expect(abortSignalAny([]).aborted).toBe(false);
  });

  it("immediately uses the first already-aborted reason", () => {
    const first = new AbortController();
    const second = new AbortController();
    first.abort("first");
    second.abort("second");
    const signal = abortSignalAny([first.signal, second.signal]);
    expect(signal.aborted).toBe(true);
    expect(signal.reason).toBe("first");
  });

  it("aborts from the first future signal and removes every listener", () => {
    const first = new AbortController();
    const second = new AbortController();
    const removeFirst = vi.spyOn(first.signal, "removeEventListener");
    const removeSecond = vi.spyOn(second.signal, "removeEventListener");
    const signal = abortSignalAny([first.signal, second.signal]);

    second.abort("second");
    first.abort("ignored");

    expect(signal.aborted).toBe(true);
    expect(signal.reason).toBe("second");
    expect(removeFirst).toHaveBeenCalledOnce();
    expect(removeSecond).toHaveBeenCalledOnce();
  });
});
