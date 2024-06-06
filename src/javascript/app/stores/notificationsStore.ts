import { create } from 'zustand';
import type { AlertColor } from '@mui/material/Alert/Alert';

interface Message {
  text: string,
  type: AlertColor,
}

export interface SettingsState {
  messages: Message[],
  addMessage: (message: Message) => void,
  dismissMessage: (index: number) => void,
}

const useNotificationsStore = create<SettingsState>(
  (set, getState) => ({
    messages: [],

    addMessage: (message: Message) => {
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
