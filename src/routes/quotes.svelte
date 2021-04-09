<script>
import { FCC_TEST_SUITE } from "$lib/";
import { onMount } from "svelte";
let testlib;

let unusedQuotes;
$: quote = (unusedQuotes && unusedQuotes.length > 0) ? unusedQuotes[0] : undefined;
$: tweetIntentURL = "https://www.twitter.com/intent/tweet?";
$: quoteStr = undefined;
$: {
  if (quote){
    let {author,text} = quote;
    let str = `"${text}"\n- ${author}`;
    quoteStr = str;
  }
}

const getNewQuote = function showQuotes(){
  if (unusedQuotes && unusedQuotes.length > 1) {
    unusedQuotes = [...unusedQuotes].slice(1)
    cacheQuotes();
  } else {
    fetchQuotes()
  };
}

const cacheQuotes = async function cacheQuotes(){
  if (!unusedQuotes) return;
  sessionStorage.setItem("quotes",JSON.stringify(unusedQuotes))
}

const fetchQuotes = async function fetchQuotes() {
  await fetch('https://goquotes-api.herokuapp.com/api/v1/random?count=5')
    .then(function parseData(res){return res.json();})
    .then(function retrieveQuotes({status,quotes}){
      if (status !== 200) return;
      console.log(`SUCCESS:Random Quotes retrieved from API:\n`,quotes);
      unusedQuotes = quotes;
      cacheQuotes();
      return quotes;
    })
    .catch(function handleError(err){console.error(err)})
}

function parseSessionStorage(){
  const data = JSON.parse(sessionStorage.getItem("quotes"));
  return data;
}

onMount(()=>{
  testlib = FCC_TEST_SUITE;
  unusedQuotes = parseSessionStorage() || null;
  if (!unusedQuotes) fetchQuotes();
})

</script>

<svelte:head>
  <script src={testlib}></script>
</svelte:head>
<main id="main" tabindex=-1>
  <h1>Random Quote Machine</h1>

  <div class="quote" id="quote-box">
    {#if quote}
      <blockquote id="text">
        {quote.text}
        <div class="author" id="author">-- <em>{quote.author}</em></div>
      </blockquote>
    {/if}
    <div class="quote-options">
      <form action={tweetIntentURL} target="_blank" rel="noopenner noreferrer">
        <input type="hidden" name="text" value={quoteStr} />
        <input id="tweet-quote" disabled={!quote} type="submit" value="Tweet this quote" />
      </form>
      <button disabled={!unusedQuotes} id="new-quote" on:click={getNewQuote}>request a new quote</button>
    </div>
  </div>
</main>

<style>
  .quote-options {
    display:flex;
  }
</style>