import { create } from 'zustand';

interface UIState {
  theme: 'dark' | 'light';
  activeSidebarTab: 'library' | 'properties' | 'templates' | 'export' | null;
  isValidationDrawerOpen: boolean;
  isExportModalOpen: boolean;
  isDataFlowSimulating: boolean;
  toggleTheme: () => void;
  setActiveSidebarTab: (tab: 'library' | 'properties' | 'templates' | 'export' | null) => void;
  setValidationDrawerOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setDataFlowSimulating: (simulating: boolean) => void;
}

export const useUIStore = create<UIState>(set => ({
  theme: 'dark',
  activeSidebarTab: 'library',
  isValidationDrawerOpen: false,
  isExportModalOpen: false,
  isDataFlowSimulating: false,

  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setActiveSidebarTab: tab => set({ activeSidebarTab: tab }),
  setValidationDrawerOpen: open => set({ isValidationDrawerOpen: open }),
  setExportModalOpen: open => set({ isExportModalOpen: open }),
  setDataFlowSimulating: simulating => set({ isDataFlowSimulating: simulating }),
}));
