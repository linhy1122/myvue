<template>
  <div class="ciallo" style="backdrop-filter: blur(10px);">
    <el-scrollbar style="height: 500px;">
      <img alt="Vue logo" class="logo" src="@/assets/C.webp" width="125" height="125" />
      <h1>CIALLO!!!!!! </h1>
      <img alt="Vue logo" class="logo" src="@/assets/C.webp" width="125" height="125" />
      <h1>CIALLO!!!!!! </h1>
      <img alt="Vue logo" class="logo" src="@/assets/C.webp" width="125" height="125" />
      <h1>CIALLO!!!!!! </h1>
    </el-scrollbar>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .ciallo {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  .scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

}
</style>
