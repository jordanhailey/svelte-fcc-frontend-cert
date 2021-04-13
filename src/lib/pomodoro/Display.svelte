<script>
import { onMount } from "svelte";
export let label;
export let display;
export let timerNameID;
export let timerDurationID;

onMount(()=>{
  if (!timerNameID) timerNameID = label + "-label"
  if (!timerDurationID) timerDurationID = label + "-length"
})
</script>

<div class="display">
  <span id={timerNameID} class="label">{label}</span>
  <span id={timerDurationID} class="length">{display}</span>
  <slot class="inputs"></slot>
</div>
<style>

  .display {
    display: flex;
    align-items: center;
  }
  .display {
    flex-direction: column;
  }
  .label {
    text-transform: capitalize;
  }
</style>
