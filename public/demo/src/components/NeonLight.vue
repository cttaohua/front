<template>
  <svg width="100%" height="100">
    <text text-anchor="middle" x="50%" y="50%" class="text text-1">
      {{this.text}}
    </text>
    <text text-anchor="middle" x="50%" y="50%" class="text text-2">
      {{this.text}}
    </text>
    <text text-anchor="middle" x="50%" y="50%" class="text text-3">
      {{this.text}}
    </text>
    <text text-anchor="middle" x="50%" y="50%" class="text text-4">
      {{this.text}}
    </text>
  </svg>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: 'SVG霓虹灯文字效果'
    }
  }
}
</script>
<style scoped>
.text{
	font-size: 64px;
	font-weight: bold;
	text-transform: uppercase;
	fill: none;
	stroke-width: 2px;
	stroke-dasharray: 90 310;
	animation: stroke 10s infinite linear;
}
.text-1{
	stroke: #3498db;
	text-shadow: 0 0 5px #3498db;
	animation-delay: -1.5s;
}
.text-2{
	stroke: #f39c12;
	text-shadow: 0 0 5px #f39c12;
	animation-delay: -3s;
}
.text-3{
	stroke: #e74c3c;
	text-shadow: 0 0 5px #e74c3c;
	animation-delay: -4.5s;
}
.text-4{
	stroke: #9b59b6;
	text-shadow: 0 0 5px #9b59b6;
	animation-delay: -6s;
}

@keyframes stroke {
	100% {
		stroke-dashoffset: -400;
	}
}
</style>
