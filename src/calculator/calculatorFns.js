import { writable } from 'svelte/store';

class DefaultCalcState {
  constructor(){
    this.lastInput = "",
    this.currentCalculation = {
      expression: ""
    },
    this.previousCalculations = [
      {
        expression: "",
        total: 0
      }
    ]
  }
}

export const calculator = writable(new DefaultCalcState());

function getState() {
  let s;
  calculator.subscribe(state => {return s=state});
  return s;
}

export function handleInput (e) {
  // partially or fully updateState with each btn/input given
  const {detail:input} = e;
  let state = getState();
  const inputChange = {lastInput:input.value};
  let calculationChanges;
  switch (input.type) {
    case "operator":
      calculationChanges = updateState(input,state);
      break;
    case "decimal":
    case "number":
      default:
      calculationChanges = updateExpression(input,state);
  }
  let updatedState = Object.assign(state,inputChange,calculationChanges);
  calculator.set(updatedState)
}

function updateState(input,state) {
  return {}
}
function updateExpression(input,state) {
  return {}
}

function checkForMultipleDecimals(currentExpression="") {
  // If the current value being entered into the expression already has one decimal, return true
  const lastVal = lastNum(currentExpression);
  return lastVal.includes(".");
}
function lastNum(exp){
  const nums = separateNumsFromOperators(exp);
  return nums[nums.length-1] || "";
}
function separateNumsFromOperators(exp){
  return exp.match(/\d+\.{0,1}\d{0,}/g);
}
