<script>
  import { createEventDispatcher } from 'svelte';
  export let id;
  export let type;
  export let value;
  export let row;
  export let column;
  let style = `--grid-row: ${row}; --grid-column: ${column};`

	const dispatch = createEventDispatcher();

	function btnClick() {
		dispatch('click', {
			value,
      id,
      type
		});
	}
</script>


<button id={id}
  {style}
  data-type={type}
  on:click={btnClick}
  tabindex=-1
>
{value}
</button>

<style>
  button {
    grid-row: var(--grid-row);
    grid-column: var(--grid-column);
  }
</style>
