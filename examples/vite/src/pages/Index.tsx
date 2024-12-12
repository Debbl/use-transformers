import { useState } from "react";
import { useTransformers } from "use-transformers";

function Index() {
  const [input, setInput] = useState("I love transformers!");
  const { isLoading, progressInfo, data, mutate } = useTransformers({
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
    <div className="flex h-full flex-col items-center justify-center gap-y-2">
      <h1>Sentiment Analysis</h1>

      <textarea
        className="mt-8 w-64 rounded-md border px-2 py-1"
        disabled={isLoading}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <label>
        <progress
          max="100"
          className="h-2 overflow-hidden rounded-md"
          value={
            progressInfo?.status === "progress" ? progressInfo.progress : 0
          }
        />
      </label>
      <div>{JSON.stringify(data)}</div>

      <button disabled={isLoading || !input} onClick={handleClick}>
        analyze
      </button>
    </div>
  );
}

export default Index;
