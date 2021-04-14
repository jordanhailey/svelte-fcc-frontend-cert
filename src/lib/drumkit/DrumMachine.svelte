<script>
import { onMount } from "svelte";
import { soundBank } from "./index.js";
let AudioContext, audioCtx, primaryGainControl;
let volume = 0.5;
const {
  Q:{src:Q_SRC,desc:Q_DESC},
  W:{src:W_SRC,desc:W_DESC},
  E:{src:E_SRC,desc:E_DESC},
  A:{src:A_SRC,desc:A_DESC},
  S:{src:S_SRC,desc:S_DESC},
  D:{src:D_SRC,desc:D_DESC},
  Z:{src:Z_SRC,desc:Z_DESC},
  X:{src:X_SRC,desc:X_DESC},
  C:{src:C_SRC,desc:C_DESC}
} = soundBank

let clip = ""

$: {
  setTimeout(()=>{
    clip = "";
  },500)
}
// Fetch file and decode to audio buffer
async function fetchAudioFile(srcUrl){
  let audio = await fetch(srcUrl)
      .then((data) => data.arrayBuffer())
      .then((bufferData) => audioCtx.decodeAudioData(bufferData));
  return audio;
}


  async function initAudioBuffers(){
    // fetches all src urls, and add decoded audio buffer to obj for quick lookup on user interaction.
    Object.keys(soundBank).map(async (key) => {
      let obj = soundBank[key];
      obj.audioBuffer = await fetchAudioFile(obj.src);
    });
  }

  async function playback(id,el) {
    if (el) return el.play();
    // Handle playback request from user interaction - https://www.youtube.com/watch?v=laCjGMhASp8
    const sound = audioCtx.createBufferSource();
    const audio = soundBank[id].audioBuffer || null;
    if (audio) {
      sound.buffer = audio;
      sound.connect(primaryGainControl);
      sound.start(audioCtx.currentTime);
    }
  }

  onMount(()=>{
    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    primaryGainControl = audioCtx.createGain();
    primaryGainControl.gain.setValueAtTime(volume,0);
    primaryGainControl.connect(audioCtx.destination);
    initAudioBuffers()
    document.addEventListener("keydown",handleKeyPress)
    return ()=>{document.removeEventListener("keydown",handleKeyPress)}
  })


  function handleBeatPadClick(e){
    const button = e.target;
    clip = button.id;
    document.querySelector("#display").innerText = clip;
    const audioEl = button.querySelector("audio");
    const id = audioEl.id;
    if (id) playback(id,audioEl);
  }

  function handleKeyPress(e){
    let id = e.key.toUpperCase();
    if (id.length > 1 || !/[QWEASDZXC]/.test(id)) return;
    const audioEl = document.getElementById(id);
    const button = audioEl.parentNode;
    clip = button.id;
    document.querySelector("#display").innerText = clip;
    button.focus();
    playback(id,audioEl);
  }
</script>

<section id="drum-machine">
  <div id="display">{clip ? clip : "select a sample"}</div>
  <!-- svelte-ignore a11y-media-has-caption -->
  <button class="drum-pad" id={Q_DESC} on:click={handleBeatPadClick}>Q<audio id="Q" class="clip" src={Q_SRC}></audio></button>
  <!-- svelte-ignore a11y-media-has-caption -->
  <button class="drum-pad" id={W_DESC} on:click={handleBeatPadClick}>W<audio id="W" class="clip" src={W_SRC}></audio></button>
  <!-- svelte-ignore a11y-media-has-caption -->
  <button class="drum-pad" id={E_DESC} on:click={handleBeatPadClick}>E<audio id="E" class="clip" src={E_SRC}></audio></button>
  <!-- svelte-ignore a11y-media-has-caption -->
  <button class="drum-pad" id={A_DESC} on:click={handleBeatPadClick}>A<audio id="A" class="clip" src={A_SRC}></audio></button>
  <!-- svelte-ignore a11y-media-has-caption -->
  <button class="drum-pad" id={S_DESC} on:click={handleBeatPadClick}>S<audio id="S" class="clip" src={S_SRC}></audio></button>
  <!-- svelte-ignore a11y-media-has-caption -->
  <button class="drum-pad" id={D_DESC} on:click={handleBeatPadClick}>D<audio id="D" class="clip" src={D_SRC}></audio></button>
  <!-- svelte-ignore a11y-media-has-caption -->
  <button class="drum-pad" id={Z_DESC} on:click={handleBeatPadClick}>Z<audio id="Z" class="clip" src={Z_SRC}></audio></button>
  <!-- svelte-ignore a11y-media-has-caption -->
  <button class="drum-pad" id={X_DESC} on:click={handleBeatPadClick}>X<audio id="X" class="clip" src={X_SRC}></audio></button>
  <!-- svelte-ignore a11y-media-has-caption -->
  <button class="drum-pad" id={C_DESC} on:click={handleBeatPadClick}>C<audio id="C" class="clip" src={C_SRC}></audio></button>
</section>
