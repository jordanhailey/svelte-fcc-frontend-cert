import { writable } from "svelte/store";

export class Pomodoro {
  constructor (
    sessionDuration = 1500,
    breakDuration = 300,
    sessionName = "Pomodoro"
  ) {
    this.isActive = false;
    this.onBreak = false;
    this.sessionDuration = sessionDuration;
    this.sessionTimeRemaining = sessionDuration;
    this.breakDuration = breakDuration;
    this.breakTimeRemaining = breakDuration;
    this.sessionName = sessionName;
    this.breakName = `${sessionName} break`;
  }
}

export const pomodoro = writable(new Pomodoro());

export function curriedStoreUpdater(store){
  return function passChangesStoreUpdateMethod(changes){
    store.update(function createNewStateObject(state){
      return Object.assign(state,changes);
    })
  }
}
