<script>
export let label;
export let value;
export let display;

$: timerLabelID = label + "-label"
$: timerLengthID = label + "-length"

let isDisabled = value == 0 ? true : false;

</script>

<div class="display">
  <span id={timerLabelID} class="label">{label}</span>
  <span id={timerLengthID} class="length">{display}</span>
</div>
<div class="inputs">
  <button disabled={isDisabled} id="{label}-increment" on:click>+</button>
  <button disabled={isDisabled} id="{label}-decrement" on:click>-</button>
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
