import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createModalSlice, type ModalSliceProps } from "./modalSlice";
import { createAuthSlice, type AuthSliceProps } from "./authSlice";
import { createNavSlice, type NavSliceProps } from "./navSlice";


export const useAppStore = create<ModalSliceProps & AuthSliceProps & NavSliceProps>()(devtools((...a) => ({
  ...createModalSlice(...a),
  ...createAuthSlice(...a),
  ...createNavSlice(...a)
})))