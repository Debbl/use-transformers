"use client";
import { useState } from "react";
import { useTransformers } from "use-transformers";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Home() {
  const [input, setInput] = useState("I love transformers!");

  const { data, isLoading, mutate } = useTransformers({
    task: "object-detection",
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
        <Input
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
