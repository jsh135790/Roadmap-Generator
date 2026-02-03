<script setup lang="ts">
import { ref } from 'vue'
import { useBrandStore } from '@/stores/brand'
import ImageUploader from '@/components/ui/ImageUploader.vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const brandStore = useBrandStore()

const uploadError = ref('')

function handleUploadError(message: string) {
  uploadError.value = message
  setTimeout(() => {
    uploadError.value = ''
  }, 3000)
}
</script>

<template>
  <div class="space-y-5">
    <!-- Error Toast -->
    <Transition name="fade">
      <div
        v-if="uploadError"
        class="fixed top-4 right-4 z-50 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg shadow-lg text-sm"
      >
        {{ uploadError }}
      </div>
    </Transition>

    <!-- Logo Upload -->
    <div class="space-y-2">
      <Label class="text-[var(--app-text)]">项目 Logo</Label>
      <ImageUploader
        :model-value="brandStore.brand.logo"
        shape="square"
        placeholder="上传 Logo (推荐 200x60)"
        :max-size="500"
        @update:model-value="brandStore.setLogo($event)"
        @error="handleUploadError"
      />
    </div>

    <!-- Avatar Upload -->
    <div class="space-y-2">
      <Label class="text-[var(--app-text)]">作者头像</Label>
      <ImageUploader
        :model-value="brandStore.brand.avatar"
        shape="circle"
        placeholder="上传头像"
        :max-size="300"
        @update:model-value="brandStore.setAvatar($event)"
        @error="handleUploadError"
      />
    </div>

    <!-- Nickname -->
    <div class="space-y-2">
      <Label for="nickname" class="text-[var(--app-text)]">作者昵称</Label>
      <Input
        id="nickname"
        :model-value="brandStore.brand.nickname"
        placeholder="输入昵称"
        maxlength="20"
        class="bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-secondary)]"
        @update:model-value="brandStore.setNickname($event as string)"
      />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
