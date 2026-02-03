import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import type { Theme, ThemeId } from '@/types'
import { useStorage } from '@/composables/useStorage'

// 预设主题配置
export const themes: Record<ThemeId, Theme> = {
  ocean: {
    id: 'ocean',
    name: '海洋蓝',
    nameEn: 'Ocean Blue',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#64748b',
      background: '#f0f9ff',
      surface: '#ffffff',
      surfaceElevated: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b',
      accent: '#06b6d4',
      border: '#e2e8f0',
      nodePending: '#94a3b8',
      nodeProgress: '#3b82f6',
      nodeCompleted: '#10b981',
    },
  },
  forest: {
    id: 'forest',
    name: '森林绿',
    nameEn: 'Forest Green',
    colors: {
      primary: '#22c55e',
      primaryHover: '#16a34a',
      secondary: '#6b7280',
      background: '#f0fdf4',
      surface: '#ffffff',
      surfaceElevated: '#ffffff',
      text: '#14532d',
      textSecondary: '#4b5563',
      accent: '#84cc16',
      border: '#dcfce7',
      nodePending: '#9ca3af',
      nodeProgress: '#22c55e',
      nodeCompleted: '#15803d',
    },
  },
  sunset: {
    id: 'sunset',
    name: '日落橙',
    nameEn: 'Sunset Orange',
    colors: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      secondary: '#78716c',
      background: '#fff7ed',
      surface: '#ffffff',
      surfaceElevated: '#ffffff',
      text: '#431407',
      textSecondary: '#57534e',
      accent: '#fb923c',
      border: '#fed7aa',
      nodePending: '#a8a29e',
      nodeProgress: '#f97316',
      nodeCompleted: '#65a30d',
    },
  },
  purple: {
    id: 'purple',
    name: '梦幻紫',
    nameEn: 'Purple Dream',
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#6b7280',
      background: '#faf5ff',
      surface: '#ffffff',
      surfaceElevated: '#ffffff',
      text: '#3b0764',
      textSecondary: '#6b7280',
      accent: '#a855f7',
      border: '#e9d5ff',
      nodePending: '#9ca3af',
      nodeProgress: '#8b5cf6',
      nodeCompleted: '#22c55e',
    },
  },
  dark: {
    id: 'dark',
    name: '暗黑模式',
    nameEn: 'Dark Mode',
    colors: {
      primary: '#60a5fa',
      primaryHover: '#3b82f6',
      secondary: '#9ca3af',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceElevated: '#334155',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      accent: '#22d3ee',
      border: '#334155',
      nodePending: '#64748b',
      nodeProgress: '#60a5fa',
      nodeCompleted: '#4ade80',
    },
  },
}

// 主题 ID 列表
export const themeIds: ThemeId[] = ['ocean', 'forest', 'sunset', 'purple', 'dark']

export const useThemeStore = defineStore('theme', () => {
  // 当前主题 ID，持久化到 localStorage
  const currentThemeId = useStorage<ThemeId>('roadmap-theme', 'ocean')

  // 当前主题配置
  const currentTheme = computed(() => themes[currentThemeId.value])

  // 所有可用主题
  const availableThemes = computed(() => themeIds.map((id) => themes[id]))

  // 切换主题
  function setTheme(themeId: ThemeId): void {
    currentThemeId.value = themeId
    applyTheme(themeId)
  }

  // 应用主题到 DOM
  function applyTheme(themeId: ThemeId): void {
    document.documentElement.setAttribute('data-theme', themeId)
  }

  // 初始化主题
  function initTheme(): void {
    applyTheme(currentThemeId.value)
  }

  // 切换到下一个主题
  function nextTheme(): void {
    const currentIndex = themeIds.indexOf(currentThemeId.value)
    const nextIndex = (currentIndex + 1) % themeIds.length
    const nextThemeId = themeIds[nextIndex]
    if (nextThemeId) {
      setTheme(nextThemeId)
    }
  }

  // 监听主题变化并自动应用
  watch(currentThemeId, (newThemeId) => {
    applyTheme(newThemeId)
  })

  return {
    currentThemeId,
    currentTheme,
    availableThemes,
    setTheme,
    initTheme,
    nextTheme,
  }
})
