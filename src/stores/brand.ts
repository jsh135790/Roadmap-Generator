import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { BrandInfo } from '@/types'
import { useStorage } from '@/composables/useStorage'

// 默认品牌信息
const defaultBrand: BrandInfo = {
  logo: null,
  avatar: null,
  nickname: 'Developer',
}

export const useBrandStore = defineStore('brand', () => {
  // 使用 localStorage 持久化
  const brand = useStorage<BrandInfo>('roadmap-brand', defaultBrand)

  // 是否有 Logo
  const hasLogo = computed(() => brand.value.logo !== null)

  // 是否有头像
  const hasAvatar = computed(() => brand.value.avatar !== null)

  // 更新 Logo
  function setLogo(logoData: string | null): void {
    brand.value.logo = logoData
  }

  // 更新头像
  function setAvatar(avatarData: string | null): void {
    brand.value.avatar = avatarData
  }

  // 更新昵称
  function setNickname(nickname: string): void {
    brand.value.nickname = nickname || 'Developer'
  }

  // 清除 Logo
  function clearLogo(): void {
    brand.value.logo = null
  }

  // 清除头像
  function clearAvatar(): void {
    brand.value.avatar = null
  }

  // 重置为默认
  function resetToDefault(): void {
    brand.value = { ...defaultBrand }
  }

  return {
    brand,
    hasLogo,
    hasAvatar,
    setLogo,
    setAvatar,
    setNickname,
    clearLogo,
    clearAvatar,
    resetToDefault,
  }
})
