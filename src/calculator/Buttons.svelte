<script>
  import Button from "./Button.svelte";
  const BTNS = {
    zero: {type: "number", value: "0"},
    one: {type: "number", value: "1"},
    two: {type: "number", value: "2"},
    three: {type: "number", value: "3"},
    four: {type: "number", value: "4"},
    five: {type: "number", value: "5"},
    six: {type: "number", value: "6"},
    seven: {type: "number", value: "7"},
    eight: {type: "number", value: "8"},
    nine: {type: "number", value: "9"},
    equals: {type: "operator", value: "="},
    add: {type: "operator", value: "+"},
    subtract: {type: "operator", value: "-"},
    multiply: {type: "operator", value: "*"},
    divide: {type: "operator", value: "÷"},
    decimal: {type: "decimal", value: "."},
    clear: {type: "operator", value: "C"},
    "clear-all": {type: "operator", value: "AC"}
  }
</script>

{#each Object.keys(BTNS) as btn}
  <Button id={btn} type={BTNS[btn].type} value={BTNS[btn].value} on:click/>
{/each}
