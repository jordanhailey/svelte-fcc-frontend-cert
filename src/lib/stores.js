import { writable } from "svelte/store";

export class Pomodoro {
  constructor (
    session = 1500,
    breakPeriod = 300,
    timerName = "Pomodoro"
  ) {
    this.active = false;
    this.session = session;
    this.breakPeriod = breakPeriod;
    this.timerName = timerName;
    this.breakName = `${timerName} break`;
  }
}

export const pomodoro = writable(new Pomodoro());
