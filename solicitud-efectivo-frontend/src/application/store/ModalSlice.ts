import type { StateCreator } from "zustand";

export type ModalSliceProps = {
    show: boolean
    handleShowModal: () => void
};

export const createModalSlice: StateCreator<ModalSliceProps> = (set, get) => ({
    show: false,
    handleShowModal: () => {
        set({ show: !get().show });
    },
});