import { ModalType } from '@/enums/common';
import { create } from 'zustand';

export type TypeModal = ModalType | null;

interface ModalStore<T> {
    typeModal: TypeModal;
    editingData: T | null;
    isOpen: boolean;
    setTypeModal: (type: TypeModal) => void;
    setEditingData: (data: T | null) => void;
    openModal: (type: TypeModal, data?: T) => void;
    closeModal: () => void;
    reset: () => void;
}

export const createModalStore = <T>() =>
    create<ModalStore<T>>((set) => ({
        typeModal: null,
        editingData: null,
        isOpen: false,
        setTypeModal: (type) => set({ typeModal: type }),
        setEditingData: (data) => set({ editingData: data }),
        openModal: (type, data) =>
            set({ typeModal: type, editingData: data, isOpen: true }),
        closeModal: () =>
            set({ typeModal: null, editingData: null, isOpen: false }),
        reset: () => set({ typeModal: null, editingData: null, isOpen: false }),
    }));
