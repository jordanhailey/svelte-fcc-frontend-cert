<script>
  import Buttons from "$calculator/Buttons.svelte";
  import Display from "$calculator/Display.svelte";
  import { calculator, handleInput } from '$calculator/calculatorFns'
</script>

<main>
  <h1>Calculator</h1>
  <section class="calc-wrapper" id="calculator">
    <Display/>
    <Buttons on:click={handleInput}/>
  </section>
  <hr/>
  <pre>
    {JSON.stringify($calculator,null,2)}
  </pre>
</main>
