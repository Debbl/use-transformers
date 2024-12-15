import type { env } from "@huggingface/transformers";

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

export type TransformersEnv = Partial<typeof env>;
