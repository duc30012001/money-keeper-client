import { ModalType } from '@/enums/common';
import { createModalStore } from '@/store/modal-store';

// Create a default store instance
const defaultStore = createModalStore<any>();

export const useModal = <T = any>() => {
    const store = defaultStore();

    const handleOpenModal = (type: ModalType | null, data?: T) => {
        store.openModal(type, data);
    };

    const handleCloseModal = () => {
        store.closeModal();
    };

    const handleReset = () => {
        store.reset();
    };

    return {
        typeModal: store.typeModal,
        editingData: store.editingData as T | null,
        isOpen: store.isOpen,
        setTypeModal: store.setTypeModal,
        setEditingData: store.setEditingData,
        openModal: handleOpenModal,
        closeModal: handleCloseModal,
        reset: handleReset,
    };
};
