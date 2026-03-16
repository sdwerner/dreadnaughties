import { create } from 'zustand';
import { simulateCombatTurn } from './calculator';

export const useGameStore = create((set, get) => ({
  // Base stats (1, 1 is a uniform distribution initially)
  baseAlpha: 1,
  baseBeta: 1,
  
  // Inventory of owned components
  inventory: [
    { id: 'radar_1', name: 'Mk1 Targeting Radar', dAlpha: 2, dBeta: 0 },
    { id: 'torpedo_1', name: 'Standard Torpedoes', dAlpha: 1, dBeta: 0 },
    { id: 'hull_1', name: 'Reinforced Hull', dAlpha: 0, dBeta: 2 },
    { id: 'evasion_1', name: 'Thruster Array', dAlpha: 0, dBeta: 3 },
  ],
  
  // Equipped components on the Dreadnaughtie
  equipped: [],

  // History of combat logs
  combatLogs: [],

  // Computed state getters
  getActiveStats: () => {
    const state = get();
    const activeAlpha = state.equipped.reduce((sum, item) => sum + item.dAlpha, state.baseAlpha);
    const activeBeta = state.equipped.reduce((sum, item) => sum + item.dBeta, state.baseBeta);
    return { alpha: activeAlpha, beta: activeBeta };
  },

  // Actions
  equipComponent: (componentId) => set((state) => {
    const item = state.inventory.find(i => i.id === componentId);
    if (!item) return state;
    if (state.equipped.find(i => i.id === componentId)) return state; // Already equipped
    return { equipped: [...state.equipped, item] };
  }),

  unequipComponent: (componentId) => set((state) => ({
    equipped: state.equipped.filter(i => i.id !== componentId)
  })),

  simulateCombat: () => {
    const state = get();
    const { alpha, beta } = state.getActiveStats();
    
    // Defer to the pure calculator engine
    const logEntry = {
      id: Date.now(),
      ...simulateCombatTurn(alpha, beta)
    };

    set((state) => ({
      combatLogs: [logEntry, ...state.combatLogs].slice(0, 10) // keep last 10
    }));

    return logEntry;
  }
}));
