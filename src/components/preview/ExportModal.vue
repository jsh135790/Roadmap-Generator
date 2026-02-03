<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useExport } from '@/composables/useExport'
import type { ExportFormat, ExportRatio } from '@/types'
import ExportCanvas from './ExportCanvas.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { exportToImage } = useExport()

// Export settings
const filename = ref('my-roadmap')
const format = ref<ExportFormat>('png')
const scale = ref(2)
const ratio = ref<ExportRatio>('auto')
const isExporting = ref(false)
const exportError = ref('')

// Format options
const formatOptions: { value: ExportFormat; label: string; desc: string }[] = [
  { value: 'png', label: 'PNG', desc: '推荐，支持透明背景' },
  { value: 'jpeg', label: 'JPEG', desc: '文件更小' },
]

// Scale options
const scaleOptions = [
  { value: 1, label: '1x', desc: '标准' },
  { value: 2, label: '2x', desc: '高清' },
  { value: 3, label: '3x', desc: '超清' },
]

// Ratio options
const ratioOptions: { value: ExportRatio; label: string; desc: string }[] = [
  { value: 'auto', label: '自适应', desc: '根据内容' },
  { value: '4:3', label: '4:3', desc: '演示文稿' },
  { value: '16:9', label: '16:9', desc: '宽屏' },
  { value: '1:1', label: '1:1', desc: '正方形' },
  { value: '3:4', label: '3:4', desc: '竖版' },
  { value: '9:16', label: '9:16', desc: '手机竖屏' },
]

async function handleExport() {
  isExporting.value = true
  exportError.value = ''

  try {
    await nextTick()
    await exportToImage('export-canvas', filename.value, {
      format: format.value,
      scale: scale.value,
    })
    emit('update:modelValue', false)
  } catch (error) {
    console.error('Export failed:', error)
    exportError.value = '导出失败，请重试'
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-md bg-[var(--app-surface)] border-[var(--app-border)]">
      <DialogHeader>
        <DialogTitle class="text-[var(--app-text)]">导出路线图</DialogTitle>
        <DialogDescription class="text-[var(--app-text-secondary)]">
          设置导出选项并生成图片
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-5 py-4">
        <!-- Filename -->
        <div class="space-y-2">
          <Label for="export-filename" class="text-[var(--app-text)]">文件名</Label>
          <Input
            id="export-filename"
            v-model="filename"
            placeholder="输入文件名"
            class="bg-[var(--app-background)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-secondary)]"
          />
        </div>

        <!-- Format -->
        <div class="space-y-2">
          <Label class="text-[var(--app-text)]">图片格式</Label>
          <RadioGroup v-model="format" class="grid grid-cols-2 gap-2">
            <div v-for="option in formatOptions" :key="option.value">
              <RadioGroupItem
                :id="`format-${option.value}`"
                :value="option.value"
                class="peer sr-only"
              />
              <Label
                :for="`format-${option.value}`"
                :class="[
                  'flex flex-col items-center justify-center px-3 py-2 rounded-lg border-2 cursor-pointer transition-all',
                  format === option.value
                    ? 'border-[var(--app-primary)] bg-[var(--app-primary)]/10'
                    : 'border-[var(--app-border)] hover:border-[var(--app-primary)]/50 hover:bg-[var(--app-primary)]/5',
                ]"
              >
                <span
                  :class="[
                    'font-semibold text-sm',
                    format === option.value ? 'text-[var(--app-primary)]' : 'text-[var(--app-text)]',
                  ]"
                >
                  {{ option.label }}
                </span>
                <span class="text-[10px] text-[var(--app-text-secondary)]">{{ option.desc }}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <!-- Scale -->
        <div class="space-y-2">
          <Label class="text-[var(--app-text)]">分辨率</Label>
          <RadioGroup v-model="scale" class="grid grid-cols-3 gap-2">
            <div v-for="option in scaleOptions" :key="option.value">
              <RadioGroupItem
                :id="`scale-${option.value}`"
                :value="option.value"
                class="peer sr-only"
              />
              <Label
                :for="`scale-${option.value}`"
                :class="[
                  'flex flex-col items-center justify-center px-2 py-2 rounded-lg border-2 cursor-pointer transition-all',
                  scale === option.value
                    ? 'border-[var(--app-primary)] bg-[var(--app-primary)]/10'
                    : 'border-[var(--app-border)] hover:border-[var(--app-primary)]/50 hover:bg-[var(--app-primary)]/5',
                ]"
              >
                <span
                  :class="[
                    'font-semibold text-sm',
                    scale === option.value ? 'text-[var(--app-primary)]' : 'text-[var(--app-text)]',
                  ]"
                >
                  {{ option.label }}
                </span>
                <span class="text-[10px] text-[var(--app-text-secondary)]">{{ option.desc }}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <!-- Ratio -->
        <div class="space-y-2">
          <Label class="text-[var(--app-text)]">画面比例</Label>
          <RadioGroup v-model="ratio" class="grid grid-cols-3 gap-2">
            <div v-for="option in ratioOptions" :key="option.value">
              <RadioGroupItem
                :id="`ratio-${option.value}`"
                :value="option.value"
                class="peer sr-only"
              />
              <Label
                :for="`ratio-${option.value}`"
                :class="[
                  'flex flex-col items-center justify-center px-2 py-2 rounded-lg border-2 cursor-pointer transition-all',
                  ratio === option.value
                    ? 'border-[var(--app-primary)] bg-[var(--app-primary)]/10'
                    : 'border-[var(--app-border)] hover:border-[var(--app-primary)]/50 hover:bg-[var(--app-primary)]/5',
                ]"
              >
                <span
                  :class="[
                    'font-semibold text-sm',
                    ratio === option.value ? 'text-[var(--app-primary)]' : 'text-[var(--app-text)]',
                  ]"
                >
                  {{ option.label }}
                </span>
                <span class="text-[10px] text-[var(--app-text-secondary)]">{{ option.desc }}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <!-- Error Message -->
        <Transition name="fade">
          <div
            v-if="exportError"
            class="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2"
          >
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ exportError }}
          </div>
        </Transition>
      </div>

      <DialogFooter class="gap-2 sm:gap-2">
        <Button
          variant="outline"
          class="border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-border)]"
          @click="emit('update:modelValue', false)"
        >
          取消
        </Button>
        <Button
          :disabled="isExporting"
          class="bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white min-w-[100px]"
          @click="handleExport"
        >
          <template v-if="isExporting">
            <svg class="w-4 h-4 mr-1.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            导出中...
          </template>
          <template v-else>
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出图片
          </template>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Hidden Export Canvas (for rendering) -->
  <div class="fixed -left-[9999px] -top-[9999px]">
    <ExportCanvas :ratio="ratio" />
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
