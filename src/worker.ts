/* eslint-disable no-restricted-globals */
import { pipeline } from "@huggingface/transformers";
import { createBirpc } from "birpc";
import type { ClientFunctions, ServerFunctions } from "./types";

const rpc = createBirpc<ClientFunctions, ServerFunctions>(
  {
    mutate: async (e) => {
      const pipe = await pipeline(e.task, e.model, {
        ...e.options,
        progress_callback: (x) => {
          rpc.progress(x);
          e.options?.progress_callback?.(x);
        },
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return pipe(...e.data);
    },
  },
  {
    post: (data) => self.postMessage(data),
    on: (fn) => self.addEventListener("message", (e) => fn(e.data)),
  },
);
