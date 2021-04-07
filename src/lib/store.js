import { writable } from 'svelte/store';
export class Expression {
  constructor(){
    this.expression = "",
    this.total = null
  }
}
export class DefaultCalcState {
  constructor(){
    this.memory = [
      new Expression()
    ]
  }
}

export const calculator = writable(new DefaultCalcState());


export class Exp {
  constructor(){
  }
}
export class DfltState {
  constructor(
    value = 0,
    expression = "",
    total = null,
    memory = []
  ){
    this.value = writable(value),
    this.expression = writable(expression),
    this.total = writable(total),
    this.memory = writable(memory)
  }
  storeUpdater = (store) => {
    return (state, changes)=>{
      console.log({store, state,changes});
    }
  }
}
export const calc = new DfltState()
