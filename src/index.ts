import { createBirpc } from "birpc";
import { useEffect, useRef, useState } from "react";
import type {
  AllTasks,
  PipelineType,
  ProgressInfo,
} from "@huggingface/transformers";
import type { BirpcOptions, BirpcReturn } from "birpc";
import type { LocalFunctions, PipelineProps, WorkerFunctions } from "~/types";

export function useTransformers<T extends PipelineType>(
  { task, model, options, env }: PipelineProps<T>,
  birpcOptions?: {
    local: BirpcOptions<WorkerFunctions>;
    worker: BirpcOptions<LocalFunctions>;
  },
) {
  const rpc = useRef<BirpcReturn<WorkerFunctions, LocalFunctions>>(null);

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<AllTasks[T]>>>();
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>();

  const transformer = async (
    ...data: Parameters<AllTasks[T]>
  ): Promise<Awaited<ReturnType<AllTasks[T]>>> => {
    setIsReady(false);
    setIsLoading(true);

    const result = await rpc.current?.pipeline({
      task,
      model,
      options,
      env,
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

    worker.postMessage({ status: "init", ...birpcOptions?.worker });

    rpc.current = createBirpc<WorkerFunctions, LocalFunctions>(
      {
        progress: (data) => {
          setProgressInfo(data);
          setIsReady(data.status === "ready");
        },
      },
      {
        post: (data) => worker.postMessage(data),
        on: (fn) => worker.addEventListener("message", fn),
        off: (fn) => worker.removeEventListener("message", fn),
        deserialize: (e) => e.data,
        ...birpcOptions?.local,
      },
    );

    return () => {
      rpc.current?.$close();
      worker.terminate();
    };
  }, []);

  return {
    isReady,
    isLoading,
    progressInfo,
    data,
    transformer,
    mutate: setData,
  };
}
