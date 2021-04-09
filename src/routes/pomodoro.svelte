<script>
import { FCC_TEST_SUITE } from "$lib/";
import Display from "$lib/pomodoro/Display.svelte";
import { pomodoro, Pomodoro } from "$lib/stores";
import { onMount } from "svelte";

let testLib;
let audioCtx;
let {timerName,breakName} = $pomodoro;
let sessionDisplay;
let breakPeriodDisplay;
let clearInt;
$: active = $pomodoro.active;
$: session = $pomodoro.session;
$: breakPeriod = $pomodoro.breakPeriod;

function underThree(){beep(100,520,200)}
function timerFinished(){beep(999,220,300)}
$: {
  if (session){
    if (session<=3 && session>=1) {
      underThree()
    }
    if (active && session == 1) setTimeout(()=>{timerFinished()},1000)
  } else if (breakPeriod){
    if (breakPeriod<=3 && breakPeriod>=1) {
      underThree()
    }
    if (active && breakPeriod == 1) setTimeout(()=>{timerFinished()},1000)
  }
}

$: {
  if (active) {
    // Start countdown
    let interval = setInterval(()=>{
      pomodoro.update(decrementTimer)
    },1000)
    clearInt = ()=>{return clearInterval(interval)};
  } else if (!active && clearInt) {
    // Stop countdown
    clearInt();
  }
}

// Show HH:MM:SS
$:{
  sessionDisplay = displayHHMMSSFromS(session);
  breakPeriodDisplay = displayHHMMSSFromS(breakPeriod);
}

function handleClick(e){
  const {id} = e.target
  switch (id) {
    case "stop":
      active = false;
      break;
    case "reset":
      // if (e.target.innerText === "reset all") {
        resetTimersToDefaultState()
      // }
      // else resetTimersToDefaultState(new Pomodoro(1500,300,"Pomodoro"))
      break;
    default:
      active = !active;
      break;
  }
}

function decrementTimer(state){
  let updatedState = {active:true}
  if (session) updatedState.session = session-1;
  else if (breakPeriod) updatedState.breakPeriod = breakPeriod-1;
  else updatedState.active = false;
  return Object.assign(state,updatedState)
}

function displayHHMMSSFromS(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
}

function resetTimersToDefaultState(timerObj = new Pomodoro()) {
  pomodoro.set(timerObj);
}

async function beep(vol, freq, duration){
  let v = await audioCtx.createOscillator()
  let u = await audioCtx.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="square"
  u.connect(audioCtx.destination)
  u.gain.value=vol*0.01
  v.start(audioCtx.currentTime)
  v.stop(audioCtx.currentTime+duration*0.001)
}

onMount(()=>{
  testLib = FCC_TEST_SUITE;
  audioCtx = new AudioContext();
})
</script>

<svelte:head>
  <script src={testLib}></script>
</svelte:head>
<main>
  <h1>Pomodoro Timer</h1>
  <div class="displays">
    <div class="active-timer">{session ? timerName : breakName}</div>
    <Display label="session" value={sessionDisplay}/>
    <Display label="break" value={breakPeriodDisplay}/>
  </div>
  {#if $pomodoro}
  <pre>{JSON.stringify($pomodoro)}</pre>
  {/if}
  <button disabled={active} id="run" on:click={handleClick}>start</button>
  <button disabled={!active} id="stop" on:click={handleClick}>stop</button>
  <button id="reset" on:click={handleClick}>{session ? "reset" : "reset all"}</button>

</main>


<style>
  main {
    width: 80%;
    margin: 0 auto;
  }

  .active-timer {
    flex: 1 100%;
    display: flex;
    justify-content: center;
  }
  .displays {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
</style>
