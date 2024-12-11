# use-transformers

Simplify use transformers.js with react in browser.

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

- use [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker)

## examples

- [Next.js](./examples/nextjs/)

## credits

- [transformers.js](https://github.com/huggingface/transformers.js)
- API design [swr](https://github.com/vercel/swr)
