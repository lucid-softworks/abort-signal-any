# @lucid-softworks/abort-signal-any

Compose signals with first-abort semantics while preserving the winning reason
and removing listeners after settlement.

```ts
import { abortSignalAny } from "@lucid-softworks/abort-signal-any";

const signal = abortSignalAny([request.signal, shutdown.signal]);
```
