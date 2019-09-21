<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="iconTag"></use>
  </svg>
</template>

<script>
import "../assets/font/iconfont.js"
export default {
  name: "iconSymbol",
  props: {
    iconName: {
      type: String,
      required: true
    }
  },
  computed: {
    iconTag () {
      return `#icon-${this.iconName}`
    }
  }
};
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
