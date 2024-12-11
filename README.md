# use-transformers

Easily use transformers.js with react in browser.

## install

```bash
npm install use-transformers
```

```tsx
import { useState } from "react";
import { useTransformers } from "use-transformers";

export default function Home() {
  const [input, setInput] = useState("I love transformers!");

  const { data, isLoading, mutate } = useTransformers({
    task: "sentiment-analysis",
    options: {
      dtype: "q8",
    },
  });

  const handleClick = () => {
    if (!input) return;
    mutate(input);
  };

  return (
    <main className="flex h-full flex-col items-center justify-center gap-y-4">
      <div className="flex w-60 flex-col items-center gap-y-4">
        <input
          disabled={isLoading}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div>{JSON.stringify(data)}</div>
        <Button onClick={handleClick}>
          ready: {JSON.stringify(isLoading)}
        </Button>
      </div>
    </main>
  );
}
```

## feature

- use [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker)

## examples

- [Next.js](./examples/nextjs/)

> next.config.ts

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  webpack: (config) => {
    // https://github.com/huggingface/transformers.js/issues/1026#issuecomment-2490410996
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
      "@huggingface/transformers": path.resolve(
        __dirname,
        "node_modules/@huggingface/transformers",
      ),
    };

    return config;
  },
};

export default nextConfig;
```

## credits

- [transformers.js](https://github.com/huggingface/transformers.js)
- API design [swr](https://github.com/vercel/swr)
