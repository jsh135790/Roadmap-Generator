<script setup lang="ts">
import { useThemeStore, themes, themeIds } from '@/stores/theme'
import { Label } from '@/components/ui/label'

const themeStore = useThemeStore()
</script>

<template>
  <div class="space-y-3">
    <Label class="text-[var(--app-text)]">主题配色</Label>
    
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="id in themeIds"
        :key="id"
        :class="[
          'relative flex flex-col items-center p-2 rounded-xl border-2 transition-all duration-200',
          themeStore.currentThemeId === id
            ? 'border-[var(--app-primary)] bg-[var(--app-primary)]/5 shadow-sm'
            : 'border-transparent hover:border-[var(--app-border)] hover:bg-[var(--app-surface-elevated)]',
        ]"
        :title="themes[id].name"
        @click="themeStore.setTheme(id)"
      >
        <!-- Color Preview -->
        <div
          class="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white shadow-md flex"
          :style="{
            background: themes[id].colors.background,
          }"
        >
          <div
            class="w-1/2 h-full"
            :style="{ background: themes[id].colors.primary }"
          />
          <div
            class="w-1/2 h-full"
            :style="{ background: themes[id].colors.surface }"
          />
        </div>
        
        <!-- Theme Name -->
        <span
          :class="[
            'mt-1.5 text-[10px] truncate w-full text-center leading-tight',
            themeStore.currentThemeId === id
              ? 'text-[var(--app-primary)] font-semibold'
              : 'text-[var(--app-text-secondary)]',
          ]"
        >
          {{ themes[id].name }}
        </span>
        
        <!-- Check Mark -->
        <Transition name="scale">
          <div
            v-if="themeStore.currentThemeId === id"
            class="absolute -top-1 -right-1 w-4 h-4 bg-[var(--app-primary)] rounded-full flex items-center justify-center shadow-sm"
          >
            <svg
              class="w-2.5 h-2.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </Transition>
      </button>
    </div>
  </div>
</template>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
