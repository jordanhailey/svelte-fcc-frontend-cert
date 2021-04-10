import { writable } from "svelte/store";

export class Pomodoro {
  constructor (
    session = 1500,
    breakPeriod = 300,
    timerName = "Pomodoro"
  ) {
    this.isActive = false;
    this.session = session;
    this.breakPeriod = breakPeriod;
    this.timerName = timerName;
    this.breakName = `${timerName} break`;
    this.defaultSession = session;
    this.defaultBreakPeriod = breakPeriod;
  }
}

export const pomodoro = writable(new Pomodoro());
