import type { PipelineType, ProgressInfo } from "@huggingface/transformers";

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
}

export interface ClientFunctions {
  progress: (data: ProgressInfo) => void;
}

export interface ServerFunctions {
  pipeline: (data: PipelineProps & { data: Array<any> }) => any;
}
