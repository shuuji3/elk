<script setup lang="ts">
defineModel<boolean>()
</script>

<template>
  <NavBottomMoreMenu
    v-slot="{ toggleVisible, show }" v-model="modelValue!" flex flex-row items-center
    place-content-center h-full flex-1 cursor-pointer
  >
    <button
      flex items-center place-content-center h-full flex-1 class="select-none"
      :class="show ? '!text-primary' : ''"
      aria-label="More menu"
      @click="toggleVisible"
    >
      <span :class="show ? 'i-ri:close-fill' : 'i-ri:more-fill'" />
    </button>
  </NavBottomMoreMenu>
</template>
