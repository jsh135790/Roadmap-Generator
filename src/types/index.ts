// 节点状态类型
export type NodeStatus = 'pending' | 'in-progress' | 'completed'

// 路线图节点
export interface RoadmapNode {
  id: string
  title: string
  description: string
  icon: string // Iconify 图标名称，如 "mdi:rocket"
  status: NodeStatus
  order: number
}

// 品牌信息
export interface BrandInfo {
  logo: string | null // Base64 图片
  avatar: string | null // Base64 图片
  nickname: string
}

// 主题颜色配置
export interface ThemeColors {
  primary: string
  primaryHover: string
  secondary: string
  background: string
  surface: string
  surfaceElevated: string
  text: string
  textSecondary: string
  accent: string
  border: string
  nodePending: string
  nodeProgress: string
  nodeCompleted: string
}

// 主题配置
export interface Theme {
  id: string
  name: string
  nameEn: string
  colors: ThemeColors
}

// 预设主题 ID 类型
export type ThemeId = 'ocean' | 'forest' | 'sunset' | 'purple' | 'dark'

// 导出格式
export type ExportFormat = 'png' | 'jpeg'

// 导出比例
export type ExportRatio = 'auto' | '4:3' | '16:9' | '1:1' | '3:4' | '9:16'

// 导出选项
export interface ExportOptions {
  format: ExportFormat
  quality: number // 0-1, 仅对 JPEG 有效
  scale: number // 导出缩放比例
  ratio?: ExportRatio // 导出比例
}

// 图标分类
export interface IconCategory {
  id: string
  name: string
  icons: string[]
}

// 应用状态
export interface AppState {
  isEditing: boolean
  selectedNodeId: string | null
  showIconPicker: boolean
  showExportModal: boolean
}
