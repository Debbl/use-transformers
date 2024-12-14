/* eslint-disable no-restricted-globals */
import { env, pipeline } from "@huggingface/transformers";
import { createBirpc } from "birpc";
import type { BirpcOptions } from "birpc";
import type { LocalFunctions, WorkerFunctions } from "~/types";

function initBirpc(workerOptions?: BirpcOptions<LocalFunctions>) {
  const rpc = createBirpc<LocalFunctions, WorkerFunctions>(
    {
      pipeline: async (e) => {
        for (const key in e.env) {
          (env as any)[key] = (e.env as any)[key];
        }

        const pipe = await pipeline(e.task, e.model, {
          ...e.options,
          progress_callback: (x) => {
            rpc.progress(x);
            e.options?.progress_callback?.(x);
          },
        });

        e.pipelineCallback?.(pipe);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return pipe(...e.data);
      },
    },
    {
      post: (data) => self.postMessage(data),
      on: (fn) => self.addEventListener("message", fn),
      off: (fn) => self.removeEventListener("message", fn),
      deserialize: (e) => e.data,
      ...workerOptions,
    },
  );
}

function onMessaged(
  e: MessageEvent<BirpcOptions<LocalFunctions> & { status: string }>,
) {
  const { status, ...workerOptions } = e.data;

  if (status === "init") {
    initBirpc(workerOptions);
  }

  self.removeEventListener("message", onMessaged);
}

self.addEventListener("message", onMessaged);
