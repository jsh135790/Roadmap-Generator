<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { RoadmapNode, NodeStatus } from '@/types'
import IconPicker from './IconPicker.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  node?: RoadmapNode | null
}

const props = withDefaults(defineProps<Props>(), {
  node: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [node: Omit<RoadmapNode, 'id' | 'order'>]
  update: [id: string, updates: Partial<Omit<RoadmapNode, 'id'>>]
}>()

const isEditing = computed(() => props.node !== null)
const modalTitle = computed(() => (isEditing.value ? '编辑节点' : '添加节点'))

// Form state
const title = ref('')
const description = ref('')
const icon = ref('mdi:star')
const status = ref<NodeStatus>('pending')
const showIconPicker = ref(false)

// Status options
const statusOptions: { value: NodeStatus; label: string; color: string }[] = [
  { value: 'pending', label: '待开始', color: 'var(--app-node-pending)' },
  { value: 'in-progress', label: '进行中', color: 'var(--app-node-progress)' },
  { value: 'completed', label: '已完成', color: 'var(--app-node-completed)' },
]

// Watch for node changes to populate form
watch(
  () => props.node,
  (newNode) => {
    if (newNode) {
      title.value = newNode.title
      description.value = newNode.description
      icon.value = newNode.icon
      status.value = newNode.status
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// Watch for modal open to reset form for new nodes
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && !props.node) {
      resetForm()
    }
  }
)

function resetForm() {
  title.value = ''
  description.value = ''
  icon.value = 'mdi:star'
  status.value = 'pending'
}

function handleSave() {
  if (!title.value.trim()) return

  const nodeData = {
    title: title.value.trim(),
    description: description.value.trim(),
    icon: icon.value,
    status: status.value,
  }

  if (isEditing.value && props.node) {
    emit('update', props.node.id, nodeData)
  } else {
    emit('save', nodeData)
  }

  emit('update:modelValue', false)
}

function handleIconSelect(selectedIcon: string) {
  icon.value = selectedIcon
  showIconPicker.value = false
}
</script>

<template>
  <Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-md bg-[var(--app-surface)] border-[var(--app-border)]">
      <DialogHeader>
        <DialogTitle class="text-[var(--app-text)]">{{ modalTitle }}</DialogTitle>
        <DialogDescription class="text-[var(--app-text-secondary)]">
          {{ isEditing ? '修改节点信息' : '填写节点信息以添加到路线图' }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <!-- Title -->
        <div class="space-y-2">
          <Label for="node-title" class="text-[var(--app-text)]">节点标题</Label>
          <Input
            id="node-title"
            v-model="title"
            placeholder="输入节点标题"
            maxlength="50"
            class="bg-[var(--app-background)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-secondary)]"
          />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <Label for="node-desc" class="text-[var(--app-text)]">节点描述</Label>
          <Textarea
            id="node-desc"
            v-model="description"
            placeholder="输入节点描述（可选）"
            :rows="3"
            maxlength="200"
            class="bg-[var(--app-background)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-secondary)] resize-none"
          />
        </div>

        <!-- Icon -->
        <div class="space-y-2">
          <Label class="text-[var(--app-text)]">节点图标</Label>
          <button
            type="button"
            class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-background)] hover:border-[var(--app-primary)] hover:bg-[var(--app-primary)]/5 transition-colors"
            @click="showIconPicker = true"
          >
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--app-primary)]/10"
            >
              <Icon :icon="icon" class="w-5 h-5 text-[var(--app-primary)]" />
            </div>
            <span class="text-sm text-[var(--app-text-secondary)]">
              点击选择图标
            </span>
            <svg
              class="w-4 h-4 ml-auto text-[var(--app-text-secondary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <!-- Status -->
        <div class="space-y-2">
          <Label class="text-[var(--app-text)]">节点状态</Label>
          <RadioGroup v-model="status" class="grid grid-cols-3 gap-2">
            <div v-for="option in statusOptions" :key="option.value">
              <RadioGroupItem
                :id="`status-${option.value}`"
                :value="option.value"
                class="peer sr-only"
              />
              <Label
                :for="`status-${option.value}`"
                :class="[
                  'flex items-center justify-center px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium',
                  status === option.value
                    ? 'border-[var(--app-primary)] bg-[var(--app-primary)]/10 text-[var(--app-primary)]'
                    : 'border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-[var(--app-primary)]/50 hover:bg-[var(--app-primary)]/5',
                ]"
              >
                {{ option.label }}
              </Label>
            </div>
          </RadioGroup>
        </div>
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
          :disabled="!title.trim()"
          class="bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white"
          @click="handleSave"
        >
          {{ isEditing ? '保存修改' : '添加节点' }}
        </Button>
      </DialogFooter>
    </DialogContent>

    <!-- Icon Picker Modal -->
    <IconPicker
      v-model="showIconPicker"
      :selected-icon="icon"
      @select="handleIconSelect"
    />
  </Dialog>
</template>
