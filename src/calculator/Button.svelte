<script>
  import { createEventDispatcher } from 'svelte';
  export let id;
  export let type;
  export let value;

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
  data-type={type}
  on:click={btnClick}
>
{value}
</button>
