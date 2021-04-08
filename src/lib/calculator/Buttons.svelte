<script>
  import Button from "./Button.svelte";
  const BTNS = {
    zero: {type: "number", inputValue: "0", row: "5", column: "1/3"},
    one: {type: "number", inputValue: "1", row: "4", column: "1"},
    two: {type: "number", inputValue: "2", row: "4", column: "2"},
    three: {type: "number", inputValue: "3", row: "4", column: "3"},
    four: {type: "number", inputValue: "4", row: "3", column: "1"},
    five: {type: "number", inputValue: "5", row: "3", column: "2"},
    six: {type: "number", inputValue: "6", row: "3", column: "3"},
    seven: {type: "number", inputValue: "7", row: "2", column: "1"},
    eight: {type: "number", inputValue: "8", row: "2", column: "2"},
    nine: {type: "number", inputValue: "9", row: "2", column: "3"},
    equals: {type: "operator", inputValue: "=", row: "5", column: "4"},
    add: {type: "operator", inputValue: "+", row: "4", column: "4"},
    subtract: {type: "operator", inputValue: "-", row: "3", column: "4"},
    multiply: {type: "operator", inputValue: "*", row: "2", column: "4"},
    divide: {type: "operator", inputValue: "/", row: "1", column: "4"},
    decimal: {type: "decimal", inputValue: ".", row: "5", column: "3"},
    clear: {type: "operator", inputValue: "C", row: "1", column: "2/4"},
    "clear-all": {type: "operator", inputValue: "AC", row: "1", column: "1"}
  }
  let focused = false;
  function handleFocus(e){
    return focused = true;
  }
  function handleFocusShift(e){
    console.log(document.activeElement,e);
    return focused = false;
  }
  $: {
    if (focused) {
      console.log("FOCUSED");
    }
  }

</script>
<section class="buttons" tabindex=0 on:focus={handleFocus} on:blur={handleFocusShift}>
  {#each Object.keys(BTNS) as btn}
    <Button id={btn}
      type={BTNS[btn].type}
      inputValue={BTNS[btn].inputValue}
      row={BTNS[btn].row}
      column={BTNS[btn].column}
      on:click/>
  {/each}
</section>

<style>
  .buttons {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: repeat(5,1fr);
    gap: 0.5rem;
  }
</style>
