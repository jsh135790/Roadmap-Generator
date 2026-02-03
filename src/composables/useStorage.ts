import { ref, watch, type Ref } from 'vue'

/**
 * 将响应式数据与 LocalStorage 同步
 * @param key localStorage 键名
 * @param defaultValue 默认值
 * @returns 响应式数据引用
 */
export function useStorage<T>(key: string, defaultValue: T): Ref<T> {
  // 从 localStorage 读取初始值
  const storedValue = localStorage.getItem(key)
  let initialValue: T = defaultValue

  if (storedValue !== null) {
    try {
      initialValue = JSON.parse(storedValue) as T
    } catch {
      console.warn(`Failed to parse localStorage value for key "${key}"`)
      initialValue = defaultValue
    }
  }

  const data = ref<T>(initialValue) as Ref<T>

  // 监听变化并同步到 localStorage
  watch(
    data,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`Failed to save to localStorage for key "${key}":`, error)
      }
    },
    { deep: true }
  )

  return data
}

/**
 * 清除指定的 localStorage 数据
 * @param keys 要清除的键名数组
 */
export function clearStorage(keys: string[]): void {
  keys.forEach((key) => localStorage.removeItem(key))
}

/**
 * 清除所有路线图相关的 localStorage 数据
 */
export function clearAllRoadmapData(): void {
  clearStorage(['roadmap-nodes', 'roadmap-brand', 'roadmap-theme'])
}
