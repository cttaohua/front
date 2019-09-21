<template>
  <div class="highlight-wrapper">
    <pre>
      <code>
        {{codeText}}
      </code>
    </pre>
  </div>
</template>
<script>
import hljs from 'highlight.js'
export default {
  props: {
    codeText: {
      type: String,
      require: true
    }
  },
  mounted () {
    this.high()
  },
  methods: {
    high () {
      hljs.initHighlightingOnLoad();
    }
  }
}
</script>
<style scoped>
pre {
  margin-bottom: 0;
}
</style>
