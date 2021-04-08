<script>
  import { createEventDispatcher } from 'svelte';
  export let id;
  export let type;
  export let inputValue;
  export let row;
  export let column;
  let style = `--grid-row: ${row}; --grid-column: ${column};`

	const dispatch = createEventDispatcher();

	function btnClick() {
		dispatch('click', {
			inputValue,
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
{inputValue}
</button>

<style>
  button {
    grid-row: var(--grid-row);
    grid-column: var(--grid-column);
  }
</style>
