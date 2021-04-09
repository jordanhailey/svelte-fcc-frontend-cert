<script>
export let label;
export let value;

$: lbID = label + "-label"
$: lb = label + " label"
$: vID = label + "-length"
</script>

<div class="display">
  <span id={lbID} class="label">{lb}</span>
  <span id={vID} class="length">{value}</span>
</div>

<style>

  .display {
    display: flex;
    flex-direction: column;
  }
  .label {
    text-transform: capitalize;
  }
  .length {

  }
</style>
