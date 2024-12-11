import { createBirpc } from "birpc";
import { useEffect, useRef, useState } from "react";
import type { PipelineType, ProgressInfo } from "@huggingface/transformers";
import type { BirpcReturn } from "birpc";
import type { ClientFunctions, PipelineProps, ServerFunctions } from "./types";

export function useTransformers<T extends PipelineType>({
  task,
  model,
  options,
}: PipelineProps<T>) {
  const rpc = useRef<BirpcReturn<ServerFunctions, ClientFunctions>>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>();

  const mutate = async (...data: any) => {
    setIsLoading(true);

    const result = await rpc.current?.mutate({
      task,
      model,
      options,
      data,
    });

    setData(result);

    return result;
  };

  useEffect(() => {
    const worker = new Worker(new URL("./worker", import.meta.url), {
      type: "module",
    });

    rpc.current = createBirpc<ServerFunctions, ClientFunctions>(
      {
        progress: (data) => {
          setProgressInfo(data);

          if (data.status === "ready") {
            setIsLoading(true);
          }
        },
      },
      {
        post: (data) => worker.postMessage(data),
        on: (fn) => worker.addEventListener("message", (e) => fn(e.data)),
      },
    );

    return () => {
      worker.terminate();
    };
  }, []);

  return {
    isLoading,
    data,
    mutate,
    progressInfo,
  };
}
