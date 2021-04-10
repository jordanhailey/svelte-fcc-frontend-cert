<script>
import { FCC_TEST_SUITE } from "$lib/";
import Display from "$lib/pomodoro/Display.svelte";
import { pomodoro, Pomodoro } from "$lib/stores";
import { onMount } from "svelte";

let testLib, sDisplay, bDisplay, dftlSDisplay, dftlBDisplay, clearInt, onBreak;
let activeTimer = {
  name:null,
  timeRemaining:null
}

$: ({
  isActive,
  session,
  breakPeriod,
  timerName,
  breakName,
  defaultSession,
  defaultBreakPeriod
} = $pomodoro);

$: {
  sDisplay = displayMMSSFromS(session,"mmss");
  bDisplay = displayMMSSFromS(breakPeriod, "mmss");
  dftlSDisplay = displayMMSSFromS(defaultSession,"mm");
  dftlBDisplay = displayMMSSFromS(defaultBreakPeriod, "mm");
}

$:{
  if (session) {
    activeTimer.name = timerName;
    activeTimer.timeRemaining = session;
  } else if (!onBreak && breakPeriod) {
    delayActiveTimerSwitch(breakName,breakPeriod)
  } else if (!session && !breakPeriod){
    delayActiveTimerSwitch(timerName,session);
  }
}

$: {
  if (isActive) {
    let interval = setInterval(()=>{
      countdownTimer();
    },1000)
    clearInt = ()=>{return clearInterval(interval)};
  } else if (!isActive && clearInt) {
    clearInt();
  }
}

$: {
  if (isActive && ((session <= 3 && session > 0) || (!session && breakPeriod <=3 && breakPeriod > 0))){
    if (session == 1 || (session === 0 && breakPeriod == 1)) setTimeout(()=>{timerFinished()},1000);
    underThree();
  }
}

onMount(function initDOM(){
  testLib = FCC_TEST_SUITE;
  return ()=>{
    if (clearInt) clearInt()
  }
})

function handleClick(e) {
  const {id} = e.target;
  if (id.includes("increment") || id.includes("decrement")) {
    return handleTimeModification(id);
  }
  switch (id) {
    case "soft-reset":
      resetTimersToDefaultState();
      break;
    case "reset":
      resetTimersToDefaultState(true);
      break;
    default:
      isActive = !isActive;
  }
}

function curriedStateUpdater(changes){
  function updateWithCallback(state){
    return Object.assign(state,changes);
  }
  pomodoro.update(updateWithCallback)
}

function handleTimeModification(id) {
  const modSecBy = id.includes("increment") ? 60 : -60;
  function modTime(sec){
    const t = sec+modSecBy;
    return t > 3600 ? 3600 : t <=0 ? 1 : t;
  };
  const changes = id.includes("session") ?
  {session:modTime(session),defaultSession:modTime(defaultSession)} :
  {breakPeriod:modTime(breakPeriod),defaultBreakPeriod:modTime(defaultBreakPeriod)};
  return curriedStateUpdater(changes);
}

function resetTimersToDefaultState(resetAll=false) {
  onBreak = false;
  if (resetAll) return curriedStateUpdater(new Pomodoro())
  const changes = {session:defaultSession,breakPeriod:defaultBreakPeriod};
  return curriedStateUpdater(changes);
}

function countdownTimer(){
  let changes = {isActive:true}
  if (session) changes.session = session-1;
  else if (breakPeriod) changes.breakPeriod = breakPeriod-1;
  else changes.isActive = false;
  return curriedStateUpdater(changes);
}

function displayMMSSFromS(seconds,str) {
  if (seconds === 3600) return "60:00";
  let start = 14, stop;
  if (`${str}`.toLowerCase() == "mmss") stop = 5;
  else if (`${str}`.toLowerCase() == "mm") stop = 2;
  // Show MM:SS
  let t = new Date(seconds * 1000).toISOString().substr(start, stop);
  return Number(t) == Number(t) ? `${Number(t)}` : t
}

function delayActiveTimerSwitch(n,t){
  setTimeout(()=>{
    onBreak=true;
    activeTimer.name = n;
    activeTimer.timeRemaining = t;
  },500)
}

async function beep(vol, freq, duration){
  let audioCtx = new AudioContext();
  const audioElement = document.querySelector('#beep');
  async function playAudio(audioEl){
    var sound = audioCtx.createOscillator(audioEl);
    let soundMod = await audioCtx.createGain();
    sound.connect(soundMod);
    sound.frequency.value=freq;
    sound.type="square";
    soundMod.connect(audioCtx.destination);
    soundMod.gain.value=vol*0.01;
    sound.start(audioCtx.currentTime);
    sound.stop(audioCtx.currentTime+duration*0.001);
  }
  playAudio(audioElement);
}

function underThree(){beep(100,520,200)};
function timerFinished(){beep(999,220,1200)};
</script>

<svelte:head>
  <script src={testLib}></script>
</svelte:head>
<main>
  <h1>Pomodoro Timer</h1>
  <div class="timer-controls">
    <div class="active-timer">
      <div id="timer-label">{activeTimer.name === timerName ? timerName : breakName}</div>
      <div id="time-left">{activeTimer.name === timerName ? sDisplay : bDisplay}</div>
      <button disabled={!session && !breakPeriod} id="start_stop" on:click={handleClick}>{!isActive ? "start" : "stop" }</button>
      <button id="reset" on:click={handleClick}>full reset</button>
      <button id="soft-reset" on:click={handleClick}>reset session timer</button>
      <audio id="beep"><track kind="captions" />This browser does not support the audio element.</audio>
    </div>
    <div>
      <Display label="session" value={dftlSDisplay} on:click={handleClick}/>
      <Display label="break" value={dftlBDisplay} on:click={handleClick}/>
    </div>
  </div>
</main>


<style>
  :global(main) {
    width: 80%;
    margin: 0 auto;
    font-feature-settings: 'tnum';
    font-variant-numeric: 'tabular-nums';
  }
  .timer-controls,.active-timer {
    display: flex;
    align-items: center;
  }
  .timer-controls {
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .active-timer {
    flex-direction: column;
    align-items: center;
  }
</style>
