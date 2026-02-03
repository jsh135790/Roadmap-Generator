<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoadmapStore } from '@/stores/roadmap'
import { useBrandStore } from '@/stores/brand'
import { useThemeStore, themes } from '@/stores/theme'
import type { NodeStatus } from '@/types'

const roadmapStore = useRoadmapStore()
const brandStore = useBrandStore()
const themeStore = useThemeStore()

// 将 hex 颜色转换为 rgba
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 根据当前主题获取状态颜色配置
const statusConfig = computed(() => {
  const currentTheme = themes[themeStore.currentThemeId]
  return {
    pending: {
      label: '待开始',
      color: currentTheme.colors.nodePending,
      bgColor: hexToRgba(currentTheme.colors.nodePending, 0.2),
    },
    'in-progress': {
      label: '进行中',
      color: currentTheme.colors.nodeProgress,
      bgColor: hexToRgba(currentTheme.colors.nodeProgress, 0.2),
    },
    completed: {
      label: '已完成',
      color: currentTheme.colors.nodeCompleted,
      bgColor: hexToRgba(currentTheme.colors.nodeCompleted, 0.2),
    },
  }
})

// 获取节点状态配置
function getStatusConfig(status: NodeStatus) {
  return statusConfig.value[status]
}
</script>

<template>
  <div class="h-full flex flex-col">
    <h2 class="text-lg font-semibold text-[var(--app-text)] mb-4">
      路线图预览
    </h2>

    <!-- Preview Container -->
    <div
      class="flex-1 overflow-auto bg-[var(--app-surface)] rounded-xl border border-[var(--app-border)] p-6"
    >
      <!-- Header: Logo & Author -->
      <div class="flex items-start justify-between mb-8 pb-6 border-b border-[var(--app-border)]">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <img
            v-if="brandStore.brand.logo"
            :src="brandStore.brand.logo"
            class="h-12 max-w-[200px] object-contain"
            alt="Logo"
          />
          <div
            v-else
            class="h-12 w-32 rounded-lg bg-[var(--app-border)] flex items-center justify-center text-[var(--app-text-secondary)] text-sm"
          >
            Logo 预留位
          </div>
        </div>

        <!-- Author Info -->
        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-sm text-[var(--app-text-secondary)]">作者</div>
            <div class="font-medium text-[var(--app-text)]">
              {{ brandStore.brand.nickname }}
            </div>
          </div>
          <div class="w-10 h-10 rounded-full overflow-hidden bg-[var(--app-border)]">
            <img
              v-if="brandStore.brand.avatar"
              :src="brandStore.brand.avatar"
              class="w-full h-full object-cover"
              alt="Avatar"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-[var(--app-text-secondary)]"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="relative pl-8">
        <!-- Timeline Line -->
        <div
          class="absolute left-3 top-0 bottom-0 w-0.5 bg-[var(--app-border)]"
        />

        <!-- Nodes -->
        <div class="space-y-6">
          <div
            v-for="(node, index) in roadmapStore.sortedNodes"
            :key="node.id"
            class="relative animate-slide-up"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <!-- Timeline Dot -->
            <div
              class="absolute -left-5 top-1 w-4 h-4 rounded-full border-4 border-[var(--app-surface)] shadow-md z-10"
              :style="{ backgroundColor: getStatusConfig(node.status).color }"
            >
              <!-- Pulse Animation for In Progress -->
              <div
                v-if="node.status === 'in-progress'"
                class="absolute inset-0 rounded-full animate-ping opacity-30"
                :style="{ backgroundColor: getStatusConfig(node.status).color }"
              />
            </div>

            <!-- Node Card -->
            <div
              class="bg-[var(--app-surface-elevated)] rounded-xl p-4 shadow-sm border border-[var(--app-border)] hover:shadow-md transition-shadow"
            >
              <div class="flex items-start gap-3">
                <!-- Icon -->
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: getStatusConfig(node.status).bgColor }"
                >
                  <Icon
                    :icon="node.icon"
                    class="w-5 h-5"
                    :style="{ color: getStatusConfig(node.status).color }"
                  />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-[var(--app-text)]">
                      {{ node.title }}
                    </h4>
                    <span
                      class="px-2 py-0.5 text-xs rounded-full"
                      :style="{
                        backgroundColor: getStatusConfig(node.status).bgColor,
                        color: getStatusConfig(node.status).color,
                      }"
                    >
                      {{ getStatusConfig(node.status).label }}
                    </span>
                  </div>
                  <p
                    v-if="node.description"
                    class="mt-1 text-sm text-[var(--app-text-secondary)]"
                  >
                    {{ node.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Connecting Line Segment (colored based on status) -->
            <div
              v-if="index < roadmapStore.sortedNodes.length - 1"
              class="absolute -left-5 top-5 w-0.5 -z-10"
              :style="{
                height: 'calc(100% + 1.5rem)',
                backgroundColor: node.status === 'completed' ? getStatusConfig('completed').color : 'transparent',
              }"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="roadmapStore.nodes.length === 0"
          class="text-center py-12"
        >
          <svg
            class="w-16 h-16 mx-auto text-[var(--app-border)] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <p class="text-[var(--app-text-secondary)]">
            在右侧添加节点以预览路线图
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
