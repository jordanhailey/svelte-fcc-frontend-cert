<script>
import marked from 'marked'
import { FCC_TEST_SUITE } from "$lib/";
import { onMount } from "svelte";
let markdown =
`# Hello World

## This is a markdown style text editor

![markdown syntax supports images linked from the public web](https://d33wubrfki0l68.cloudfront.net/e7ed9fe4bafe46e275c807d63591f85f9ab246ba/e2d28/assets/images/tux.png)

> You can write *__blockquotes__* by prefixing a line with \`>\`.

You can write \`code\` blocks

\`\`\`
... By opening and closing a section with three (3) tick marks \`\`\`
\`\`\`

What should you do?
- Read more about [markdown](https://www.markdownguide.org/basic-syntax/)
- Try the editor!
`

let testLib;

function handleFCCTest(){
  const preview = document.getElementById("preview");
  let output = marked(markdown,{breaks:true});
  preview.innerHTML = output
  console.log({markdown,output});
}

onMount(()=>{
  testLib = FCC_TEST_SUITE
})

</script>

<svelte:head>
  <script src={testLib}></script>
</svelte:head>
<main>
  <h1>Markdown Previewer</h1>
  <section class="md-generator">
    <section class="editor">
      <textarea bind:value={markdown} placeholder="Enter markdown here" id="editor" on:keyup={handleFCCTest}/>
    </section>
    <section class="preview" id="preview">
      {@html marked(markdown,{breaks:true})}
    </section>
  </section>

</main>

<style>
  main {
    max-width: 1200px;
  }
  main, .md-generator, .editor, .preview {
    height: 95%;
  }

  .md-generator {
    display: flex;
  }
  .editor, .preview, textarea {
		width: 100%;
	}
  textarea, .preview {
    overflow-y: scroll;
  }

  textarea {
    height: 100%;
		font-family: monospace, Roboto;
		border: 1px solid black;
		margin: 0;
    padding: 1rem;
	}

	.preview {
    padding: 0.5rem 2rem;
	}
</style>
