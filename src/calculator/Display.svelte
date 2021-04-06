<script>
  export let expression="";
  export let total="";
</script>

<div id="display">
  {#if expression}
    exp: {expression}
  {:else}
    tot: {total}
  {/if}
</div>
