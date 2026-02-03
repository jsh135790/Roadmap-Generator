<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { RoadmapNode } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  node: RoadmapNode
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [node: RoadmapNode]
  delete: [id: string]
  'update:status': [id: string, status: RoadmapNode['status']]
}>()

const statusConfig = {
  pending: {
    label: '待开始',
    color: 'var(--app-node-pending)',
  },
  'in-progress': {
    label: '进行中',
    color: 'var(--app-node-progress)',
  },
  completed: {
    label: '已完成',
    color: 'var(--app-node-completed)',
  },
}

const statusOptions: RoadmapNode['status'][] = ['pending', 'in-progress', 'completed']

function handleStatusChange(value: unknown) {
  if (typeof value === 'string') {
    emit('update:status', props.node.id, value as RoadmapNode['status'])
  }
}
</script>

<template>
  <div
    class="group bg-[var(--app-surface)] rounded-xl border border-[var(--app-border)] p-3.5 hover:shadow-md hover:border-[var(--app-primary)]/30 transition-all duration-200"
  >
    <div class="flex items-start gap-3">
      <!-- Drag Handle -->
      <div
        class="drag-handle flex-shrink-0 mt-0.5 p-1 rounded-md cursor-grab active:cursor-grabbing text-[var(--app-text-secondary)] hover:text-[var(--app-primary)] hover:bg-[var(--app-primary)]/10 transition-colors"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
          />
        </svg>
      </div>

      <!-- Icon -->
      <div
        class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        :style="{ backgroundColor: `${statusConfig[node.status].color}15` }"
      >
        <Icon
          :icon="node.icon"
          class="w-5 h-5"
          :style="{ color: statusConfig[node.status].color }"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-sm text-[var(--app-text)] truncate leading-tight">
          {{ node.title }}
        </h4>
        <p class="text-xs text-[var(--app-text-secondary)] line-clamp-2 mt-1 leading-relaxed">
          {{ node.description || '暂无描述' }}
        </p>

        <!-- Status Select -->
        <div class="mt-2.5">
          <Select :model-value="node.status" @update:model-value="handleStatusChange">
            <SelectTrigger
              class="h-7 w-auto min-w-[90px] text-xs px-2.5 border-0 focus:ring-1"
              :style="{
                backgroundColor: `${statusConfig[node.status].color}15`,
                color: statusConfig[node.status].color,
              }"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="status in statusOptions"
                :key="status"
                :value="status"
                class="text-xs"
              >
                {{ statusConfig[status].label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          class="h-7 w-7 text-[var(--app-text-secondary)] hover:text-[var(--app-primary)] hover:bg-[var(--app-primary)]/10"
          @click="emit('edit', node)"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="h-7 w-7 text-[var(--app-text-secondary)] hover:text-destructive hover:bg-destructive/10"
          @click="emit('delete', node.id)"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
