import { create } from 'zustand';
import { randomBeta, getBetaMean } from './betaDistribution';

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
    
    // Draw from distribution (result is between 0 and 1)
    const roll = randomBeta(alpha, beta);
    
    // For our simplified battleship model, rolling > 0.5 is a "hit/victory", < 0.5 is "miss/defeat"
    // In a full game, it would be compared to enemy's distribution or a threshold
    const isVictory = roll > 0.5;

    const logEntry = {
      id: Date.now(),
      alpha,
      beta,
      roll: roll.toFixed(3),
      expectedMean: getBetaMean(alpha, beta).toFixed(3),
      result: isVictory ? 'Victory' : 'Defeat',
      timestamp: new Date().toLocaleTimeString()
    };

    set((state) => ({
      combatLogs: [logEntry, ...state.combatLogs].slice(0, 10) // keep last 10
    }));

    return logEntry;
  }
}));
