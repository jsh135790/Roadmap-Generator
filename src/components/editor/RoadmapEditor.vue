<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useRoadmapStore } from '@/stores/roadmap'
import type { RoadmapNode } from '@/types'
import NodeCard from './NodeCard.vue'
import NodeForm from './NodeForm.vue'
import { Button } from '@/components/ui/button'

const roadmapStore = useRoadmapStore()

// Modal state
const showNodeForm = ref(false)
const editingNode = ref<RoadmapNode | null>(null)

// Open form for new node
function openNewNodeForm() {
  editingNode.value = null
  showNodeForm.value = true
}

// Open form for editing
function openEditNodeForm(node: RoadmapNode) {
  editingNode.value = node
  showNodeForm.value = true
}

// Handle save new node
function handleSaveNode(nodeData: Omit<RoadmapNode, 'id' | 'order'>) {
  roadmapStore.addNode(nodeData)
}

// Handle update node
function handleUpdateNode(id: string, updates: Partial<Omit<RoadmapNode, 'id'>>) {
  roadmapStore.updateNode(id, updates)
}

// Handle delete node
function handleDeleteNode(id: string) {
  if (confirm('确定要删除这个节点吗？')) {
    roadmapStore.deleteNode(id)
  }
}

// Handle status change
function handleStatusChange(id: string, status: RoadmapNode['status']) {
  roadmapStore.updateNodeStatus(id, status)
}

// Handle drag end
function handleDragEnd() {
  // The nodes array is already updated by v-model
  // Just need to update the order field
  roadmapStore.setNodes(roadmapStore.nodes)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-base font-semibold text-[var(--app-text)]">
          节点列表
        </h2>
        <p class="text-xs text-[var(--app-text-secondary)] mt-0.5">
          共 {{ roadmapStore.nodes.length }} 个节点
        </p>
      </div>
      <Button
        size="sm"
        class="bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white h-8"
        @click="openNewNodeForm"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        添加
      </Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-2 mb-4">
      <div class="px-3 py-2.5 rounded-xl bg-[var(--app-node-completed)]/10 text-center">
        <div class="text-xl font-bold" style="color: var(--app-node-completed)">
          {{ roadmapStore.stats.completed }}
        </div>
        <div class="text-[10px] text-[var(--app-text-secondary)] font-medium">已完成</div>
      </div>
      <div class="px-3 py-2.5 rounded-xl bg-[var(--app-node-progress)]/10 text-center">
        <div class="text-xl font-bold" style="color: var(--app-node-progress)">
          {{ roadmapStore.stats.inProgress }}
        </div>
        <div class="text-[10px] text-[var(--app-text-secondary)] font-medium">进行中</div>
      </div>
      <div class="px-3 py-2.5 rounded-xl bg-[var(--app-node-pending)]/10 text-center">
        <div class="text-xl font-bold" style="color: var(--app-node-pending)">
          {{ roadmapStore.stats.pending }}
        </div>
        <div class="text-[10px] text-[var(--app-text-secondary)] font-medium">待开始</div>
      </div>
    </div>

    <!-- Node List -->
    <div class="flex-1 overflow-y-auto space-y-2.5 pr-1 -mr-1">
      <VueDraggable
        v-model="roadmapStore.nodes"
        :animation="200"
        handle=".drag-handle"
        ghost-class="opacity-40"
        class="space-y-2.5"
        @end="handleDragEnd"
      >
        <NodeCard
          v-for="node in roadmapStore.nodes"
          :key="node.id"
          :node="node"
          @edit="openEditNodeForm"
          @delete="handleDeleteNode"
          @update:status="handleStatusChange"
        />
      </VueDraggable>

      <!-- Empty State -->
      <div
        v-if="roadmapStore.nodes.length === 0"
        class="flex flex-col items-center justify-center py-12 text-center"
      >
        <div class="w-16 h-16 rounded-2xl bg-[var(--app-border)]/50 flex items-center justify-center mb-4">
          <svg
            class="w-8 h-8 text-[var(--app-text-secondary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <p class="text-sm text-[var(--app-text-secondary)] mb-4">
          还没有节点，点击添加
        </p>
        <Button
          class="bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white"
          @click="openNewNodeForm"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          添加第一个节点
        </Button>
      </div>
    </div>

    <!-- Node Form Modal -->
    <NodeForm
      v-model="showNodeForm"
      :node="editingNode"
      @save="handleSaveNode"
      @update="handleUpdateNode"
    />
  </div>
</template>
