<script>
  export let value="";
  export let expression="";
  export let total="";
</script>

<div id="display">
  <span id="expression">{expression}</span><span id="value">{value}</span><span id="total">{total}</span>
</div>

<style>
  :root {
    --exp-color: #999;
    --val-color: #000;
    --tol-color: #888;
  }

  #display {
    display: flex;
    justify-content: flex-end;
  }
  #expression, #value, #total {

  }
  #expression {
    color: var(--exp-color);
  }

  #value {
    color: var(--val-color);
  }

  #total {
    color: var(--tol-color);
  }
</style>
