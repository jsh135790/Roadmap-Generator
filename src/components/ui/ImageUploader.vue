<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

interface Props {
  modelValue: string | null
  accept?: string
  maxSize?: number // KB
  shape?: 'square' | 'circle'
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/png, image/jpeg, image/gif, image/webp',
  maxSize: 500, // 500KB
  shape: 'square',
  placeholder: '点击或拖拽上传图片',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  error: [message: string]
}>()

const isDragging = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function handleClick() {
  inputRef.value?.click()
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0 && files[0]) {
    processFile(files[0])
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0 && files[0]) {
    processFile(files[0])
  }
  // Reset input
  target.value = ''
}

function processFile(file: File) {
  // Check file type
  if (!file.type.startsWith('image/')) {
    emit('error', '请上传图片文件')
    return
  }

  // Check file size
  if (file.size > props.maxSize * 1024) {
    emit('error', `图片大小不能超过 ${props.maxSize}KB`)
    return
  }

  // Convert to base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    emit('update:modelValue', result)
  }
  reader.onerror = () => {
    emit('error', '图片读取失败')
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  emit('update:modelValue', null)
}
</script>

<template>
  <div class="w-full">
    <div
      :class="[
        'relative group cursor-pointer overflow-hidden transition-all duration-200',
        'border-2 border-dashed rounded-lg',
        isDragging
          ? 'border-[var(--app-primary)] bg-[var(--app-primary)]/10'
          : 'border-[var(--app-border)] hover:border-[var(--app-primary)] hover:bg-[var(--app-primary)]/5',
        {
          'aspect-video': shape === 'square',
          '!rounded-full w-24 h-24 mx-auto': shape === 'circle',
        },
      ]"
      @click="handleClick"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- Preview -->
      <img
        v-if="modelValue"
        :src="modelValue"
        :class="[
          'w-full h-full object-cover',
          { 'rounded-full': shape === 'circle' },
        ]"
        alt="Preview"
      />

      <!-- Placeholder -->
      <div
        v-else
        class="absolute inset-0 flex flex-col items-center justify-center text-[var(--app-text-secondary)]"
      >
        <svg
          :class="[
            'mb-2',
            shape === 'circle' ? 'w-6 h-6' : 'w-8 h-8',
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span :class="['text-center px-2', shape === 'circle' ? 'text-[10px]' : 'text-xs']">
          {{ placeholder }}
        </span>
      </div>

      <!-- Overlay for existing image -->
      <div
        v-if="modelValue"
        class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >
        <span class="text-white text-sm font-medium">点击更换</span>
      </div>

      <!-- Hidden Input -->
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        class="hidden"
        @change="handleFileChange"
      />
    </div>

    <!-- Clear Button -->
    <div v-if="modelValue" class="mt-2" :class="{ 'text-center': shape === 'circle' }">
      <Button
        variant="ghost"
        size="sm"
        class="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
        @click.stop="clearImage"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        删除图片
      </Button>
    </div>
  </div>
</template>
