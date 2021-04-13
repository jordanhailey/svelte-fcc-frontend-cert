<script>
  export let disabled;
  export let id;
  export let text;
</script>

<button {id} disabled={disabled} on:click>{text}</button>
