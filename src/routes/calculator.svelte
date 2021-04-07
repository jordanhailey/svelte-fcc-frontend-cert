<script>
  import Buttons from "$calculator/Buttons.svelte";
  import Display from "$calculator/Display.svelte";
  import { updateExpression, updateValue } from "$calculator/calculatorFns";
  import { calculator, calc } from '$lib/store';
  import { onMount } from "svelte";

  const {value:v,expression:e,memory:m,total:t} = calc
  console.log(v,e,m,t);
  console.log(calc.storeUpdater(v)($v,1));
  console.log(v,e,m,t);
  $: expression = $calculator.memory[0].expression;
  // Get the most recent total, or show zero (0)
  $: total = $calculator.memory[0].total ?
  $calculator.memory[0].total :
  $calculator.memory[1] ?
  $calculator.memory[1].total ?
  $calculator.memory[1].total :
  0 :
  0

  function handleClick (e,store=calculator,state=$calculator) {
    const {detail:input} = e;
    let changes;
    switch (input.type) {
      case "operator":
        changes = updateExpression(input,state);
        break;
      case "decimal":
      case "number":
        default:
        changes = updateValue(input,state);
    }
    store.set(Object.assign(state,changes));
  }

  async function setCache(e) {
    if (!e) return sessionStorage.removeItem("calculator");
    return sessionStorage.setItem("calculator",JSON.stringify($calculator));
  }

  async function loadCache(store=calculator) {
    const savedCache = sessionStorage.getItem("calculator");
    if (!savedCache) return null;
    return store.set(JSON.parse(savedCache));
  }


  onMount(()=>{loadCache()})

</script>

<main>
  <h1>Calculator</h1>
  <section class="calc-wrapper" id="calculator">
    <Display {expression} {total}/>
    <Buttons on:click={handleClick} on:click={setCache}/>
  </section>
  <hr/>
  <pre>
    {JSON.stringify($calculator,null,2)}
  </pre>
</main>


<style>

  main {
    width: 80vw;
    max-width: 800px;
    margin: 0 auto;
  }
  .calc-wrapper {
    display: grid;
    grid-template-columns: 1fr 10fr 1fr;
    grid-template-rows: 1fr 2fr 8fr 1fr;
  }

  :global(.calc-wrapper:first-child) {
    grid-row: 2;
    grid-column: 2;
  }
  :global(#display) {
    grid-row: 2;
    grid-column: 2;
  }
  :global(.buttons) {
    grid-row: 3;
    grid-column: 2;
  }

</style>
