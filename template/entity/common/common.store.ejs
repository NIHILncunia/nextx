import { create, type StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CommonActions {
  setWord: (word: string) => void;
}

interface CommonState {
  word: string;
  actions: CommonActions;
}

const createCommonSlice: StateCreator<
  CommonState,
  [['zustand/immer', never]]
> = (set) => ({
  word: '',
  actions: {
    setWord: (word) =>
      set((state) => {
        state.word = word;
      }),
  },
});

const useCommonStore = create<CommonState>()(
  persist(immer(createCommonSlice), {
    name: 'common-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ word: state.word, }),
  })
);

export const useWord = () => useCommonStore((state) => state.word);

export const useCommonActions = () => useCommonStore((state) => state.actions);
