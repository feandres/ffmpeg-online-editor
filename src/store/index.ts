import { create } from "zustand";

import type { EditConfig } from "@/utils/edit-config";

import type { Stages } from "@/utils/app-stages";


interface AppState {
  stage: Stages;
  inputName: string | null;
  outputUrl: string | null;
  editConfig: EditConfig | null;
  processing: boolean;
  setStage: (stage: Stages) => void;
  setInputName: (name: string | null) => void;
  setOutputUrl: (url: string | null) => void;
  setEditConfig: (config: EditConfig | null) => void;
  setProcessing: (processing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  stage: "loading",
  inputName: null,
  outputUrl: null,
  editConfig: null,
  processing: false,
  setStage: (stage) => set({ stage }),
  setInputName: (inputName) => set({ inputName }),
  setOutputUrl: (outputUrl) => set({ outputUrl }),
  setEditConfig: (editConfig) => set({ editConfig }),
  setProcessing: (processing) => set({ processing }),
}));