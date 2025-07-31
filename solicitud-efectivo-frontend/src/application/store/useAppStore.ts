import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createModalSlice, type ModalSliceProps } from "./ModalSlice";


export const useAppStore = create<ModalSliceProps>()(devtools((...a) => ({
  ...createModalSlice(...a)
})))