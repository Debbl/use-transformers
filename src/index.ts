import { createBirpc } from "birpc";
import { useEffect, useRef, useState } from "react";
import type {
  AllTasks,
  PipelineType,
  ProgressInfo,
} from "@huggingface/transformers";
import type { BirpcReturn } from "birpc";
import type {
  ClientFunctions,
  PipelineProps,
  ServerFunctions,
  UnwrapPromise,
} from "./types";

export function useTransformers<T extends PipelineType>({
  task,
  model,
  options,
}: PipelineProps<T>) {
  const rpc = useRef<BirpcReturn<ServerFunctions, ClientFunctions>>(null);

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<UnwrapPromise<ReturnType<AllTasks[T]>>>();
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>();

  const mutate = async (...data: any) => {
    setIsReady(false);
    setIsLoading(true);

    const result = await rpc.current?.pipeline({
      task,
      model,
      options,
      data,
    });

    setIsLoading(false);
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
          setIsReady(data.status === "ready");
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
    isReady,
    isLoading,
    data,
    mutate,
    progressInfo,
  };
}
