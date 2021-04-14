<script>
import { FCC_TEST_SUITE } from "$lib/";
import DrumMachine from "$drumkit/DrumMachine.svelte";
import { onMount } from "svelte";

let testLib;

onMount(()=>{
  testLib = FCC_TEST_SUITE;
})
</script>

<svelte:head>
  <script src={testLib}></script>
</svelte:head>

<main>
  <h1>Drumkit</h1>
  <DrumMachine/>
</main>
