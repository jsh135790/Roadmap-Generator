<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useThemeStore } from '@/stores/theme'
import { useRoadmapStore } from '@/stores/roadmap'
import BrandSettings from '@/components/settings/BrandSettings.vue'
import ThemeSelector from '@/components/settings/ThemeSelector.vue'
import RoadmapPreview from '@/components/preview/RoadmapPreview.vue'
import RoadmapEditor from '@/components/editor/RoadmapEditor.vue'
import ExportModal from '@/components/preview/ExportModal.vue'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const themeStore = useThemeStore()
const roadmapStore = useRoadmapStore()

// Modal states
const showExportModal = ref(false)

// Mobile tab state
const activeTab = ref<'settings' | 'preview' | 'editor'>('preview')

// Sidebar collapsed state
const leftSidebarCollapsed = ref(false)
const rightSidebarCollapsed = ref(false)

// GitHub repository URL
const githubUrl = 'https://github.com/jsh135790/roadmap-generator'

// Initialize theme on mount
onMounted(() => {
  themeStore.initTheme()
})

function handleReset() {
  if (confirm('确定要重置所有数据吗？这将清除所有节点和设置。')) {
    roadmapStore.resetToDefault()
  }
}
</script>

<template>
  <TooltipProvider>
    <div class="h-screen flex flex-col bg-[var(--app-background)] overflow-hidden">
      <!-- Header -->
      <header
        class="flex-shrink-0 h-14 bg-[var(--app-surface)] border-b border-[var(--app-border)] px-4 flex items-center justify-between shadow-sm"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-accent)] flex items-center justify-center shadow-md">
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
          </div>
          <h1 class="text-lg font-semibold text-[var(--app-text)]">
            路线图生成器
          </h1>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- GitHub Button -->
          <Tooltip>
            <TooltipTrigger as-child>
              <a
                :href="githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center text-[var(--app-text-secondary)] hover:text-[var(--app-primary)] hover:bg-[var(--app-primary)]/10 transition-colors"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>GitHub</p>
            </TooltipContent>
          </Tooltip>

          <!-- Theme Quick Switch -->
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="text-[var(--app-text-secondary)] hover:text-[var(--app-primary)] hover:bg-[var(--app-primary)]/10"
                @click="themeStore.nextTheme()"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>切换主题</p>
            </TooltipContent>
          </Tooltip>

          <!-- Reset Button -->
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="text-[var(--app-text-secondary)] hover:text-destructive hover:bg-destructive/10"
                @click="handleReset"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>重置数据</p>
            </TooltipContent>
          </Tooltip>

          <!-- Export Button -->
          <Button
            size="sm"
            class="ml-2 bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white"
            @click="showExportModal = true"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            导出图片
          </Button>
        </div>
      </header>

      <!-- Mobile Tab Bar -->
      <div class="lg:hidden flex border-b border-[var(--app-border)] bg-[var(--app-surface)]">
        <button
          v-for="tab in [
            { key: 'settings', label: '设置' },
            { key: 'preview', label: '预览' },
            { key: 'editor', label: '编辑' },
          ]"
          :key="tab.key"
          :class="[
            'flex-1 py-3 text-sm font-medium transition-colors',
            activeTab === tab.key
              ? 'text-[var(--app-primary)] border-b-2 border-[var(--app-primary)]'
              : 'text-[var(--app-text-secondary)]',
          ]"
          @click="activeTab = tab.key as 'settings' | 'preview' | 'editor'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Main Content -->
      <main class="flex-1 flex overflow-hidden">
        <!-- Left Sidebar (Settings) -->
        <aside
          :class="[
            'flex-shrink-0 bg-[var(--app-surface)] border-r border-[var(--app-border)] transition-all duration-300 overflow-hidden',
            'hidden lg:block',
            leftSidebarCollapsed ? 'w-0' : 'w-72',
          ]"
        >
          <div class="h-full overflow-y-auto p-4 space-y-6">
            <!-- Brand Settings -->
            <div>
              <h3 class="text-xs font-semibold text-[var(--app-text-secondary)] uppercase tracking-wider mb-4">
                品牌设置
              </h3>
              <BrandSettings />
            </div>

            <!-- Divider -->
            <div class="h-px bg-[var(--app-border)]" />

            <!-- Theme Settings -->
            <ThemeSelector />
          </div>
        </aside>

        <!-- Toggle Left Sidebar Button -->
        <button
          class="hidden lg:flex flex-shrink-0 w-4 items-center justify-center bg-[var(--app-surface)] border-r border-[var(--app-border)] hover:bg-[var(--app-border)] transition-colors"
          @click="leftSidebarCollapsed = !leftSidebarCollapsed"
        >
          <svg
            :class="['w-3 h-3 text-[var(--app-text-secondary)] transition-transform', leftSidebarCollapsed ? '' : 'rotate-180']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Center (Preview) -->
        <div class="flex-1 overflow-hidden p-4 lg:p-6">
          <!-- Desktop: Always show preview -->
          <div class="hidden lg:block h-full">
            <RoadmapPreview />
          </div>

          <!-- Mobile: Tab content -->
          <div class="lg:hidden h-full">
            <div v-if="activeTab === 'settings'" class="h-full overflow-y-auto space-y-6">
              <BrandSettings />
              <div class="h-px bg-[var(--app-border)]" />
              <ThemeSelector />
            </div>
            <div v-else-if="activeTab === 'preview'" class="h-full">
              <RoadmapPreview />
            </div>
            <div v-else-if="activeTab === 'editor'" class="h-full">
              <RoadmapEditor />
            </div>
          </div>
        </div>

        <!-- Toggle Right Sidebar Button -->
        <button
          class="hidden lg:flex flex-shrink-0 w-4 items-center justify-center bg-[var(--app-surface)] border-l border-[var(--app-border)] hover:bg-[var(--app-border)] transition-colors"
          @click="rightSidebarCollapsed = !rightSidebarCollapsed"
        >
          <svg
            :class="['w-3 h-3 text-[var(--app-text-secondary)] transition-transform', rightSidebarCollapsed ? 'rotate-180' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Right Sidebar (Editor) -->
        <aside
          :class="[
            'flex-shrink-0 bg-[var(--app-surface)] border-l border-[var(--app-border)] transition-all duration-300 overflow-hidden',
            'hidden lg:block',
            rightSidebarCollapsed ? 'w-0' : 'w-80',
          ]"
        >
          <div class="h-full overflow-hidden p-4">
            <RoadmapEditor />
          </div>
        </aside>
      </main>

      <!-- Export Modal -->
      <ExportModal v-model="showExportModal" />
    </div>
  </TooltipProvider>
</template>
