import type { StateCreator } from "zustand";

export type ModalSliceProps = {
    showHeaderModal: boolean
    showAdminTableModal: boolean
    handleShowModal: (view: string) => void
    closeModal: (view: string) => void
};

export const createModalSlice: StateCreator<ModalSliceProps> = (set, get) => ({
    showHeaderModal: false,
    showAdminTableModal: false,
    handleShowModal: (view: string) => {
        if(view === "header") {
            set({ showHeaderModal: !get().showHeaderModal });
        } else if(view === "adminTable") {
            set({ showAdminTableModal: !get().showAdminTableModal });
        }
    },
    closeModal: (view: string) => {
        if(view === "header") {
            set({ showHeaderModal: false });
        } else if(view === "adminTable") {
            set({ showAdminTableModal: false });
        }
    },
});
