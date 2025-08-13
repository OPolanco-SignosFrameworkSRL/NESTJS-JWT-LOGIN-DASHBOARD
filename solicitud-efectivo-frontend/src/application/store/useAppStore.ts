import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createModalSlice, type ModalSliceProps } from "./modalSlice";
import { createAuthSlice, type AuthSliceProps } from "./authSlice";


export const useAppStore = create<ModalSliceProps & AuthSliceProps>()(devtools((...a) => ({
  ...createModalSlice(...a),
  ...createAuthSlice(...a)
})))