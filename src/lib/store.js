import { writable } from 'svelte/store';

export const calculator = writable({
  currentCalculation: {
    expression: "",
    total: null
  },
  previousCalculations: [
    {
      expression: "",
      total: 0
    }
  ]
});
