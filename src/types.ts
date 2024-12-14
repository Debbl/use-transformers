import type {
  AllTasks,
  PipelineType,
  ProgressInfo,
} from "@huggingface/transformers";
import type { TransformersEnv } from "./types-shims";

export interface PretrainedModelOptions {
  progress_callback?: (progress: any) => void;
  config?: any;
  cache_dir?: string;
  local_files_only?: boolean;
  revision?: string;
  device?: any;
  dtype?: any;
  model_file_name?: string;
  session_options?: any;
}

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
