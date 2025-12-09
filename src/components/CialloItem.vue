<template>
  <div>
    <span id="ciallo-text" class="shake-text"><span style="animation-delay: 0.0935655s;">C</span><span
        style="animation-delay: 0.318393s;">i</span><span style="animation-delay: 0.413155s;">a</span><span
        style="animation-delay: 0.24062s;">l</span><span style="animation-delay: 0.173003s;">l</span><span
        style="animation-delay: 0.248909s;">o</span><span style="animation-delay: 0.377515s;">～</span><span
        style="animation-delay: 0.0979662s;">(</span><span style="animation-delay: 0.25305s;">∠</span><span
        style="animation-delay: 0.18591s;">・</span><span style="animation-delay: 0.28715s;">ω</span><span
        style="animation-delay: 0.432797s;">&lt;</span><span style="animation-delay: 0.0389441s;">
      </span><span style="animation-delay: 0.0406722s;">)</span><span style="animation-delay: 0.111785s;">⌒</span>
      <span style="animation-delay: 0.306224s;">★</span></span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CialloItem'
});
</script>
<style scoped>
.shake-text {
  font-size: 24px;
  display: inline-block;
}

.shake-text span {
  display: inline-block;
  animation: shake 0.5s infinite, colorChange 2s infinite;
}

@keyframes shake {
  0% {
    transform: translate(0, 0);
  }

  25% {
    transform: translate(-1px, -1px);
  }

  50% {
    transform: translate(1px, 1px);
  }

  75% {
    transform: translate(-1px, 1px);
  }

  100% {
    transform: translate(1px, -1px);
  }
}

@keyframes colorChange {
  0% {
    color: red;
  }

  25% {
    color: blue;
  }

  50% {
    color: green;
  }

  75% {
    color: orange;
  }

  100% {
    color: purple;
  }
}
</style>
