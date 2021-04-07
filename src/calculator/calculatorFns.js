import { DefaultCalcState, Expression } from '$lib/store';

export function updateExpression(input,state) {
  const {id} = input;
  const calculation = {...state.memory[0]};
  switch (id) {
    case "equals":
      calculation.total = evaluateExp(calculation.expression);
      calculation.expression = `${calculation.expression}${input.value}`;
      state.memory[0] = calculation;
      state.memory = [new Expression(),...state.memory]
      return state
    case "clear":
      if (calculation.expression) {
        const substr = calculation.expression.substr(0,calculation.expression.length-1)
        calculation.expression = substr;
        break;
      }
    case "clear-all":
      return state = new DefaultCalcState();
    default:
      calculation.expression = `${calculation.expression}${input.value}`;
    }
  state.memory[0] = calculation;
  return state;
}

export function updateValue(input,state) {
  const calculation = {...state.memory[0]};
  calculation.expression = `${calculation.expression}${input.value}`;
  state.memory[0] = calculation;
  return state;
}

function evaluateExp(exp){
  const total = new Function(`return ${exp};`)();
  if (isNaN(total)) return "NaN";
  switch (total) {
    case Infinity:
      return "Infinity";
      case -Infinity:
      return "-Infinity";
    default:
      return total;
  }
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
