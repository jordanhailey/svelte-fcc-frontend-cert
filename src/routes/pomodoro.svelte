<script>
import { FCC_TEST_SUITE } from "$lib/";
import Button from "$lib/pomodoro/Button.svelte";
import Display from "$lib/pomodoro/Display.svelte";
import { pomodoro, Pomodoro } from "$lib/stores";
import { onMount, tick } from "svelte";

let state = $pomodoro;
let isActive, sessionDuration, sessionTimeRemaining, breakDuration, breakTimeRemaining, sessionName, breakName, onBreak,
    testLib, activeTimerName, activeInterval, audioCtx, audioBeep;

$: {
  isActive = state.isActive;
  sessionDuration = state.sessionDuration;
  sessionTimeRemaining = state.sessionTimeRemaining;
  breakDuration = state.breakDuration;
  breakTimeRemaining = state.breakTimeRemaining;
  sessionName = state.sessionName;
  breakName = state.breakName;
  onBreak = state.onBreak;
  activeTimerName = !onBreak ? sessionName : breakName;
  cleanupInterval();
  (async function handleState(){
    // await tick();
    if (isActive) {
      if (activeTimerName === sessionName && !sessionTimeRemaining) {
        document.querySelector("#timer-label").innerText = `${sessionName} Complete!`;
        setTimeout(()=>{document.querySelector("#time-left").innerText = displayMMSSFromS(breakTimeRemaining,"mmss");},500)
        setTimeout(()=>{state.onBreak=!onBreak},1000)
      }
      else if (!breakTimeRemaining) setTimeout(()=>{resetTimers(true,true);},1000);
      else if (sessionTimeRemaining || breakTimeRemaining) {
          return activeInterval = setInterval(()=>{
            let changes = {};
            activeTimerName === sessionName ?
            changes.sessionTimeRemaining = modTimer(state.sessionTimeRemaining)(-1) :
            changes.breakTimeRemaining = modTimer(state.breakTimeRemaining)(-1);
            state = Object.assign(state,changes);
            sessionTimeRemaining = state.sessionTimeRemaining;
            breakTimeRemaining = state.breakTimeRemaining;
            if (activeTimerName === sessionName && sessionTimeRemaining === 0 ) audioBeep.play()
            else if (activeTimerName === breakName && breakTimeRemaining === 0 ) audioBeep.play()
            document.querySelector("#time-left").innerText = displayMMSSFromS(activeTimerName === sessionName ? sessionTimeRemaining : breakTimeRemaining,"mmss");
          },1000)
        }
    }
  })()
}

$: {
  pomodoro.set(state)
}

onMount(function initDOM(){
  testLib = FCC_TEST_SUITE;
  audioBeep = document.querySelector("#beep");
  return ()=>{
    cleanupInterval();
  }
})

function cleanupInterval(){
  if (activeInterval) clearInterval(activeInterval);
}

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

function handleTimeModification(id) {
  const modSecBy = id.includes("increment") ? 60 : -60;
  const changes = id.includes("session") ?
  {sessionTimeRemaining:modTimer(state.sessionTimeRemaining)(modSecBy),sessionDuration:modTimer(state.sessionDuration)(modSecBy)} :
  {breakTimeRemaining:modTimer(state.breakTimeRemaining)(modSecBy),breakDuration:modTimer(state.breakDuration)(modSecBy)};
  state = Object.assign(state,changes);
  sessionDuration = state.sessionDuration;
  sessionTimeRemaining = state.sessionTimeRemaining;
  breakDuration = state.breakDuration;
  breakTimeRemaining = state.breakTimeRemaining;
  document.querySelector("#time-left").innerText = displayMMSSFromS(activeTimerName === sessionName ? sessionTimeRemaining : breakTimeRemaining,"mmss");
  document.querySelector("#session-length").innerText = displayMMSSFromS(sessionDuration,"mm");
  document.querySelector("#break-length").innerText = displayMMSSFromS(breakDuration,"mm");
  return
}

function resetTimers(keepRunning=false,useCurrentValues=false) {
  cleanupInterval();
  audioBeep.pause();
  audioBeep.currentTime = 0;
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
  state = Object.assign(state,changes);
  isActive = state.isActive;
  activeTimerName = sessionName;
  onBreak = state.onBreak;
  sessionDuration = state.sessionDuration;
  breakDuration = state.breakDuration;
  sessionTimeRemaining = state.sessionTimeRemaining;
  breakTimeRemaining = state.breakTimeRemaining;
  document.querySelector("#timer-label").innerText = sessionName;
  document.querySelector("#time-left").innerText = displayMMSSFromS(sessionTimeRemaining,"mmss");
  document.querySelector("#session-length").innerText = displayMMSSFromS(sessionDuration,"mm");
  document.querySelector("#break-length").innerText = displayMMSSFromS(breakDuration,"mm");
  return
}

function toggleCountdown(){
  let changes  = {};
  if (isActive) changes.isActive = false;
  else changes.isActive = true;
  state = Object.assign(state,changes);
  isActive = state.isActive;
  return;
}

function modTimer(tmrVal){
  return function modTime(modTime){
    const t = tmrVal+modTime;
    if (t > 3600) return 3600;
    if (t <= 60) {
      if (modTime == -1) {
        if (t < 0) return 0;
        return t
      }
      return 60;
    };
    return t;
  }
}

function displayMMSSFromS(seconds,str) {
  if (!seconds) {
    if (`${str}`.toLowerCase() == "mm") return "0";
    return "00:00"
  }
  if (seconds <= 60 && `${str}`.toLowerCase() == "mm") {return "1"}
  if (seconds === 3600) {
    if (`${str}`.toLowerCase() == "mm") return "60";
    return "60:00";
  }
  let start = 14, stop;
  if (`${str}`.toLowerCase() == "mmss") stop = 5;
  else if (`${str}`.toLowerCase() == "mm") stop = 2;
  let t = new Date(seconds * 1000).toISOString().substr(start, stop);
  return Number(t) == Number(t) ? `${Number(t)}` : t
}
</script>

<svelte:head>
  <script src={testLib}></script>
</svelte:head>
<main>
  <!-- {@debug sessionDuration,breakDuration,sessionTimeRemaining,breakTimeRemaining} -->
  <h1>Pomodoro Timer</h1>
    <Display label={activeTimerName == sessionName ? sessionName : breakName} timerNameID="timer-label" timerDurationID="time-left" display={displayMMSSFromS(activeTimerName == sessionName ? sessionTimeRemaining : breakTimeRemaining,"mmss")}>
      <Button id="start_stop" text={!isActive ? "start" : "stop" } on:click={handleClick} disabled={!sessionTimeRemaining && !breakTimeRemaining}/>
      <Button id="reset" text="reset" on:click={handleClick}/>
    </Display>
    <Display label="session" display={displayMMSSFromS(sessionDuration,"mm")} on:click={handleClick}>
      <button id="session-increment" on:click={handleClick}>+</button>
      <button id="session-decrement" on:click={handleClick}>-</button>
    </Display>
    <Display label="break" display={displayMMSSFromS(breakDuration,"mm")} on:click={handleClick}>
      <button id="break-increment" on:click={handleClick}>+</button>
      <button id="break-decrement" on:click={handleClick}>-</button>
    </Display>
    <audio
      id="beep"
      preload="auto"
      src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
    ><track kind="captions" />This browser does not support the audio element.</audio>
</main>
