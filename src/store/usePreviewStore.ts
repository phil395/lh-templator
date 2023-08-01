import { create } from "zustand";
import { DEFAULT_VAR_VALUES, MessageCreator } from "../models";
import type { PreviewProps } from "../components";

interface PreviewState {
  message: string | null;
}

interface PreviewActions {
  init: (props: PreviewProps) => void;
  updateVariableValue: (variableName: string, newValue: string) => void;
}

type PreviewStore = PreviewState & PreviewActions;

let creator: MessageCreator | null = null;

/** Converts an array of variable names to an object,
 * where the keys are the names of variables
 * and the values are the default values of those variables. */
const initVariables = (arrVarNames: string[]) => {
  return arrVarNames.reduce<Record<string, string>>((acc, cur) => {
    acc[cur] = DEFAULT_VAR_VALUES;
    return acc;
  }, {});
};

export const usePreviewStore = create<PreviewStore>()((set, get) => ({
  message: null,
  init: ({ template, arrVarNames }) => {
    const variables = initVariables(arrVarNames);
    creator = new MessageCreator(template, variables);
    set({ message: creator.create() });
  },
  updateVariableValue: (variableName, newValue) => {
    if (!creator) return;
    creator.updateVariableValue(variableName, newValue);
    set({ message: creator.create() });
  },
}));
