<script>
export let label;
export let value;

$: timerLabelID = label + "-label"
$: timerLengthID = label + "-length"
</script>

<div class="display">
  <span id={timerLabelID} class="label">{label}</span>
  <span id={timerLengthID} class="length">{value}</span>
</div>
<div class="inputs">
  <button id="{label}-increment" on:click>+</button>
  <button id="{label}-decrement" on:click>-</button>
</div>

<style>

  .display, .inputs {
    display: flex;
    align-items: center;
  }
  .display {
    flex-direction: column;
  }
  .inputs {
    justify-content: center;
  }
  .label {
    text-transform: capitalize;
  }
</style>
