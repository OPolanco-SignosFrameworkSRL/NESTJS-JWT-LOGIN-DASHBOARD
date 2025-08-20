import type { StateCreator } from "zustand";

export type NavSliceProps = {
    isNavOpen: boolean
    handleShowNav: () => void
    closeNav: () => void
};

export const createNavSlice: StateCreator<NavSliceProps> = (set, get) => ({
    isNavOpen: true,
    handleShowNav: () => {

        set({ isNavOpen: !get().isNavOpen });
        
    },
    closeNav: () => {
     
        set({ isNavOpen: false });
        
    }

});