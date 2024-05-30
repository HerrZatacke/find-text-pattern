import { create } from 'zustand';

export interface SettingsState {
  messages: string[],
  addMessage: (message: string) => void,
  dismissMessage: (index: number) => void,
}

const useNotificationsStore = create<SettingsState>(
  (set, getState) => ({
    messages: [],

    addMessage: (message: string) => {
      const { messages } = getState();
      set(() => ({
        messages: [...messages, message],
      }));
    },

    dismissMessage: (dismissIndex: number) => {
      const { messages } = getState();
      set({
        messages: messages.filter((_, index) => dismissIndex !== index),
      });
    },
  }),
);

export default useNotificationsStore;
