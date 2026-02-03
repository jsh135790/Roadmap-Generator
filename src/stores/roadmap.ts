import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { RoadmapNode, NodeStatus } from '@/types'
import { useStorage } from '@/composables/useStorage'

// 生成唯一 ID
function generateId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// 默认节点示例
const defaultNodes: RoadmapNode[] = [
  {
    id: generateId(),
    title: '项目启动',
    description: '确定项目目标和技术栈',
    icon: 'mdi:rocket-launch',
    status: 'completed',
    order: 0,
  },
  {
    id: generateId(),
    title: '需求分析',
    description: '收集和分析用户需求',
    icon: 'mdi:file-document-outline',
    status: 'completed',
    order: 1,
  },
  {
    id: generateId(),
    title: '设计阶段',
    description: 'UI/UX 设计和技术架构设计',
    icon: 'mdi:palette',
    status: 'in-progress',
    order: 2,
  },
  {
    id: generateId(),
    title: '开发实现',
    description: '编码实现核心功能',
    icon: 'mdi:code-braces',
    status: 'pending',
    order: 3,
  },
  {
    id: generateId(),
    title: '测试上线',
    description: '测试、优化并部署上线',
    icon: 'mdi:check-circle',
    status: 'pending',
    order: 4,
  },
]

export const useRoadmapStore = defineStore('roadmap', () => {
  // 使用 localStorage 持久化
  const nodes = useStorage<RoadmapNode[]>('roadmap-nodes', defaultNodes)

  // 按 order 排序的节点列表
  const sortedNodes = computed(() => {
    return [...nodes.value].sort((a, b) => a.order - b.order)
  })

  // 统计信息
  const stats = computed(() => {
    const total = nodes.value.length
    const completed = nodes.value.filter((n) => n.status === 'completed').length
    const inProgress = nodes.value.filter((n) => n.status === 'in-progress').length
    const pending = nodes.value.filter((n) => n.status === 'pending').length
    return { total, completed, inProgress, pending }
  })

  // 添加节点
  function addNode(node: Omit<RoadmapNode, 'id' | 'order'>): RoadmapNode {
    const newNode: RoadmapNode = {
      ...node,
      id: generateId(),
      order: nodes.value.length,
    }
    nodes.value.push(newNode)
    return newNode
  }

  // 更新节点
  function updateNode(id: string, updates: Partial<Omit<RoadmapNode, 'id'>>): void {
    const index = nodes.value.findIndex((n) => n.id === id)
    const currentNode = nodes.value[index]
    if (index !== -1 && currentNode) {
      nodes.value[index] = {
        id: currentNode.id,
        title: updates.title ?? currentNode.title,
        description: updates.description ?? currentNode.description,
        icon: updates.icon ?? currentNode.icon,
        status: updates.status ?? currentNode.status,
        order: updates.order ?? currentNode.order,
      }
    }
  }

  // 删除节点
  function deleteNode(id: string): void {
    const index = nodes.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      nodes.value.splice(index, 1)
      // 重新排序
      reorderNodes()
    }
  }

  // 更新节点状态
  function updateNodeStatus(id: string, status: NodeStatus): void {
    updateNode(id, { status })
  }

  // 重新排序节点（更新 order 字段）
  function reorderNodes(): void {
    nodes.value.forEach((node, index) => {
      node.order = index
    })
  }

  // 移动节点位置
  function moveNode(fromIndex: number, toIndex: number): void {
    const removed = nodes.value.splice(fromIndex, 1)
    if (removed[0]) {
      nodes.value.splice(toIndex, 0, removed[0])
      reorderNodes()
    }
  }

  // 设置完整的节点列表（用于拖拽排序后更新）
  function setNodes(newNodes: RoadmapNode[]): void {
    nodes.value = newNodes.map((node, index) => ({
      ...node,
      order: index,
    }))
  }

  // 获取单个节点
  function getNode(id: string): RoadmapNode | undefined {
    return nodes.value.find((n) => n.id === id)
  }

  // 重置为默认节点
  function resetToDefault(): void {
    nodes.value = defaultNodes.map((node, index) => ({
      ...node,
      id: generateId(),
      order: index,
    }))
  }

  return {
    nodes,
    sortedNodes,
    stats,
    addNode,
    updateNode,
    deleteNode,
    updateNodeStatus,
    moveNode,
    setNodes,
    getNode,
    resetToDefault,
  }
})
