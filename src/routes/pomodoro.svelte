<script>
import { FCC_TEST_SUITE } from "$lib/";
import Display from "$lib/pomodoro/Display.svelte";
import { pomodoro, Pomodoro, curriedStoreUpdater } from "$lib/stores";
import { onMount, tick } from "svelte";

$: (
  {
    isActive,
    sessionDuration,
    sessionTimeRemaining,
    breakDuration,
    breakTimeRemaining,
    sessionName,
    breakName,
    onBreak
  } = $pomodoro
);

let testLib, timerName, timerTimeRemaining, activeInterval;

function toggleOnBreak(){
  curriedPomodoroUpdater({onBreak:!onBreak})
}
$: {
  if (!onBreak){
    timerName = sessionName;
    timerTimeRemaining = sessionTimeRemaining;
    !sessionTimeRemaining ? setTimeout(toggleOnBreak,1000) : null;
  } else {
    timerName = breakName;
    timerTimeRemaining = breakTimeRemaining;
    if (!breakTimeRemaining) {
      setTimeout(()=>{
        resetTimers(true,true);
      },1000);
    };
  }
}

function cleanupInterval(){
  if (activeInterval) clearInterval(activeInterval);
}
$: {
  cleanupInterval();
  if (isActive) {
    if (timerTimeRemaining) {
      activeInterval = setInterval(()=>{
        let changes = {};
        timerName === sessionName ?
        changes.sessionTimeRemaining = modTimer(sessionTimeRemaining)(-1) :
        changes.breakTimeRemaining = modTimer(breakTimeRemaining)(-1);
        curriedPomodoroUpdater(changes);
      },1000)
    } else {
      timerName = `${timerName == sessionName ? "Session Completed! Break Beginning Now..." : "Break Completed! Session Restarting Now..." } `
    }
  }
}

$: {
  if (isActive && timerTimeRemaining <= 3) {
    timerTimeRemaining > 0 ? underThree() : timerFinished();
  }
}

onMount(function initDOM(){
  testLib = FCC_TEST_SUITE;
  return ()=>{
    cleanupInterval()
  }
})

async function handleClick(e) {
  const {id} = e.target;
  if (id.includes("increment") || id.includes("decrement")) {
    return handleTimeModification(id);
  }
  switch (id) {
    case "reset":
      resetTimers();
      break;
    default:
      toggleCountdown();
  }
  await tick();
}

const curriedPomodoroUpdater = curriedStoreUpdater(pomodoro);

function handleTimeModification(id) {
  const modSecBy = id.includes("increment") ? 60 : -60;
  const changes = id.includes("session") ?
  {sessionTimeRemaining:modTimer(sessionTimeRemaining)(modSecBy),sessionDuration:modTimer(sessionDuration)(modSecBy)} :
  {breakTimeRemaining:modTimer(breakTimeRemaining)(modSecBy),breakDuration:modTimer(breakDuration)(modSecBy)};
  curriedPomodoroUpdater(changes);
  return
}

function modTimer(tmrVal){
  return function modTime(modTime){
    const t = tmrVal+modTime;
    if (t > 3600) return 3600;
    if (t <= 0) {
      if (modTime == -60) return 1;
      else return 0;
    }
    else return t;
  }
}

function resetTimers(keepRunning=false,useCurrentValues=false) {
  let changes = new Pomodoro();
  if (keepRunning) changes.isActive = true;
  if (useCurrentValues) {
    changes = Object.assign(
      changes,{
        sessionDuration,
        breakDuration,
        sessionTimeRemaining:sessionDuration,
        breakTimeRemaining:breakDuration
      })}
  return curriedPomodoroUpdater(changes);
}

function toggleCountdown(){
  let changes  = {};
  if (isActive) changes.isActive = false;
  else changes.isActive = true;
  return curriedPomodoroUpdater(changes);
}

function displayMMSSFromS(seconds,str) {
  if (!seconds) return "00:00"
  if (seconds === 3600) return "60:00";
  let start = 14, stop;
  if (`${str}`.toLowerCase() == "mmss") stop = 5;
  else if (`${str}`.toLowerCase() == "mm") stop = 2;
  // Show MM:SS
  let t = new Date(seconds * 1000).toISOString().substr(start, stop);
  return Number(t) == Number(t) ? `${Number(t)}` : t
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
      <div id="timer-label">{timerName}</div>
      <div id="time-left">{displayMMSSFromS(timerTimeRemaining,"mmss")}</div>
      <button disabled={!sessionTimeRemaining && !breakTimeRemaining} id="start_stop" on:click={handleClick}>{!isActive ? "start" : "stop" }</button>
      <button id="reset" on:click={handleClick}>reset</button>
      <audio id="beep"><track kind="captions" />This browser does not support the audio element.</audio>
    </div>
    <div>
      <Display label="session" value={sessionDuration} display={displayMMSSFromS(sessionDuration,"mm")} on:click={handleClick}/>
      <Display label="break" value={breakDuration} display={displayMMSSFromS(breakDuration,"mm")} on:click={handleClick}/>
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

  .timer-label {
    text-transform: uppercase;
  }
</style>
