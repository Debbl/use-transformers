import type {
  AllTasks,
  PipelineType,
  ProgressInfo,
} from "@huggingface/transformers";
import type { PretrainedModelOptions, TransformersEnv } from "./types-shims";

export interface PipelineProps<T extends PipelineType = PipelineType> {
  task: T;
  model?: string;
  options?: PretrainedModelOptions;
  env?: TransformersEnv;
  pipelineCallback?: (pipeline: AllTasks[T]) => void;
}

export interface LocalFunctions {
  progress: (data: ProgressInfo) => void;
}

export interface WorkerFunctions {
  pipeline: (data: PipelineProps & { data: Array<any> }) => any;
}
