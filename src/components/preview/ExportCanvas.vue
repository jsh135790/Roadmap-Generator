<script setup lang="ts">
import { computed, ref, onMounted, onUpdated, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoadmapStore } from '@/stores/roadmap'
import { useBrandStore } from '@/stores/brand'
import { useThemeStore, themes } from '@/stores/theme'
import type { NodeStatus, ExportRatio } from '@/types'

interface Props {
  ratio?: ExportRatio
}

const props = withDefaults(defineProps<Props>(), {
  ratio: 'auto',
})

const roadmapStore = useRoadmapStore()
const brandStore = useBrandStore()
const themeStore = useThemeStore()

// html2canvas 文字偏移修正值（负值向上移动）
const TEXT_OFFSET = '-8px'

// 画布基础宽度
const BASE_WIDTH = 600

// 内容容器引用
const contentRef = ref<HTMLDivElement | null>(null)
const contentHeight = ref(0)

// 更新内容高度
function updateContentHeight() {
  nextTick(() => {
    if (contentRef.value) {
      contentHeight.value = contentRef.value.scrollHeight
    }
  })
}

onMounted(updateContentHeight)
onUpdated(updateContentHeight)

// 根据比例计算画布尺寸
const canvasStyle = computed(() => {
  const baseStyle = {
    backgroundColor: themeColors.value.background,
    padding: '32px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    lineHeight: '1.5',
    boxSizing: 'border-box' as const,
  }

  if (props.ratio === 'auto') {
    return {
      ...baseStyle,
      minWidth: `${BASE_WIDTH}px`,
    }
  }

  // 解析比例
  const ratioParts = props.ratio.split(':').map(Number)
  const widthRatio = ratioParts[0] ?? 4
  const heightRatio = ratioParts[1] ?? 3
  
  // 计算最小高度以满足比例要求
  // 实际内容高度 + padding
  const actualContentHeight = contentHeight.value || 400
  const paddingTotal = 64 // 32px * 2
  
  // 根据内容高度计算宽度，或根据基础宽度计算高度，取较大者
  const widthFromContent = ((actualContentHeight + paddingTotal) * widthRatio) / heightRatio
  const heightFromWidth = (BASE_WIDTH * heightRatio) / widthRatio
  
  // 选择能容纳内容的尺寸
  if (widthFromContent >= BASE_WIDTH) {
    return {
      ...baseStyle,
      width: `${Math.max(widthFromContent, BASE_WIDTH)}px`,
      minHeight: `${actualContentHeight + paddingTotal}px`,
    }
  } else {
    return {
      ...baseStyle,
      width: `${BASE_WIDTH}px`,
      minHeight: `${Math.max(heightFromWidth, actualContentHeight + paddingTotal)}px`,
    }
  }
})

// 根据当前主题获取状态颜色配置
const statusConfig = computed(() => {
  const currentTheme = themes[themeStore.currentThemeId]
  return {
    pending: {
      label: '待开始',
      color: currentTheme.colors.nodePending,
      bgColor: hexToRgba(currentTheme.colors.nodePending, 0.15),
    },
    'in-progress': {
      label: '进行中',
      color: currentTheme.colors.nodeProgress,
      bgColor: hexToRgba(currentTheme.colors.nodeProgress, 0.15),
    },
    completed: {
      label: '已完成',
      color: currentTheme.colors.nodeCompleted,
      bgColor: hexToRgba(currentTheme.colors.nodeCompleted, 0.15),
    },
  }
})

// 将 hex 颜色转换为 rgba
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 获取节点状态配置
function getStatusConfig(status: NodeStatus) {
  return statusConfig.value[status]
}

// 获取当前主题颜色
const themeColors = computed(() => themes[themeStore.currentThemeId].colors)
</script>

<template>
  <div
    id="export-canvas"
    :style="canvasStyle"
  >
    <div ref="contentRef">
      <!-- Header -->
      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px;">
        <!-- Logo -->
        <div style="flex-shrink: 0;">
          <img
            v-if="brandStore.brand.logo"
            :src="brandStore.brand.logo"
            style="height: 56px; max-width: 220px; object-fit: contain; display: block;"
            alt="Logo"
          />
          <div
            v-else
            :style="{
              height: '56px',
              width: '144px',
              borderRadius: '8px',
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
          >
            <span :style="{
              color: themeColors.textSecondary,
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '1',
              transform: `translateY(${TEXT_OFFSET})`,
            }">
              LOGO
            </span>
          </div>
        </div>

        <!-- Author -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="text-align: right;">
            <div :style="{
              fontSize: '14px',
              color: themeColors.textSecondary,
              lineHeight: '1.4',
              marginBottom: '2px',
              transform: `translateY(${TEXT_OFFSET})`,
            }">Created by</div>
            <div :style="{
              fontSize: '18px',
              fontWeight: '600',
              color: themeColors.text,
              lineHeight: '1.2',
              transform: `translateY(${TEXT_OFFSET})`,
            }">
              {{ brandStore.brand.nickname }}
            </div>
          </div>
          <div
            :style="{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `3px solid ${themeColors.primary}`,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              flexShrink: '0',
            }"
          >
            <img
              v-if="brandStore.brand.avatar"
              :src="brandStore.brand.avatar"
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
              alt="Avatar"
            />
            <div
              v-else
              :style="{
                width: '100%',
                height: '100%',
                backgroundColor: themeColors.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }"
            >
              <svg
                :style="{ width: '32px', height: '32px', color: themeColors.textSecondary, display: 'block' }"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div :style="{ height: '1px', backgroundColor: themeColors.border, marginBottom: '32px' }" />

      <!-- Timeline -->
      <div style="position: relative; padding-left: 40px;">
        <!-- Timeline Line -->
        <div
          :style="{
            position: 'absolute',
            left: '16px',
            top: '8px',
            bottom: '8px',
            width: '4px',
            borderRadius: '4px',
            background: `linear-gradient(to bottom, ${themeColors.nodeCompleted}, ${themeColors.nodeProgress}, ${themeColors.nodePending})`,
          }"
        />

        <!-- Nodes -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div
            v-for="node in roadmapStore.sortedNodes"
            :key="node.id"
            style="position: relative;"
          >
            <!-- Timeline Dot -->
            <div
              :style="{
                position: 'absolute',
                left: '-24px',
                top: '20px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: `4px solid ${themeColors.background}`,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                backgroundColor: getStatusConfig(node.status).color,
                boxSizing: 'border-box',
              }"
            />

            <!-- Node Card -->
            <div
              :style="{
                backgroundColor: themeColors.surface,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${themeColors.border}`,
              }"
            >
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <!-- Icon -->
                <div
                  :style="{
                    flexShrink: '0',
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: getStatusConfig(node.status).bgColor,
                  }"
                >
                  <Icon
                    :icon="node.icon"
                    :style="{
                      width: '24px',
                      height: '24px',
                      color: getStatusConfig(node.status).color,
                      display: 'block',
                    }"
                  />
                </div>

                <!-- Content -->
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <span :style="{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: themeColors.text,
                      lineHeight: '1.2',
                      transform: `translateY(${TEXT_OFFSET})`,
                    }">
                      {{ node.title }}
                    </span>
                    <span
                      :style="{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: '500',
                        borderRadius: '12px',
                        backgroundColor: getStatusConfig(node.status).bgColor,
                        color: getStatusConfig(node.status).color,
                        lineHeight: '1',
                      }"
                    >
                      <span :style="{ transform: `translateY(${TEXT_OFFSET})` }">
                        {{ getStatusConfig(node.status).label }}
                      </span>
                    </span>
                  </div>
                  <p
                    v-if="node.description"
                    :style="{
                      color: themeColors.textSecondary,
                      lineHeight: '1.6',
                      margin: '0',
                      fontSize: '14px',
                      transform: `translateY(${TEXT_OFFSET})`,
                    }"
                  >
                    {{ node.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="roadmapStore.nodes.length === 0"
          style="text-align: center; padding: 64px 0;"
        >
          <p :style="{
            color: themeColors.textSecondary,
            fontSize: '18px',
            margin: '0',
            lineHeight: '1.5',
            transform: `translateY(${TEXT_OFFSET})`,
          }">
            暂无路线图节点
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        :style="{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: `1px solid ${themeColors.border}`,
          textAlign: 'center',
        }"
      >
        <p :style="{
          fontSize: '14px',
          color: themeColors.textSecondary,
          margin: '0',
          lineHeight: '1.5',
          transform: `translateY(${TEXT_OFFSET})`,
        }">
          Generated by Roadmap Generator
        </p>
      </div>
    </div>
  </div>
</template>
