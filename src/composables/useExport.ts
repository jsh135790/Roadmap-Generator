import html2canvas from 'html2canvas'
import type { ExportOptions } from '@/types'

const defaultOptions: ExportOptions = {
  format: 'png',
  quality: 0.92,
  scale: 2, // 2x for better quality
}

/**
 * 清理克隆文档中的所有外部样式
 * ExportCanvas 完全使用内联样式，所以可以安全移除外部样式
 * 这样可以避免 html2canvas 解析不支持的 CSS 颜色函数（oklch, color-mix 等）
 */
function prepareDocumentForExport(clonedDoc: Document, exportElementId: string): void {
  // 1. 移除所有 style 标签
  const styleElements = clonedDoc.querySelectorAll('style')
  styleElements.forEach((style) => style.remove())

  // 2. 移除所有 link[rel="stylesheet"] 标签
  const linkElements = clonedDoc.querySelectorAll('link[rel="stylesheet"]')
  linkElements.forEach((link) => link.remove())

  // 3. 获取导出元素
  const exportElement = clonedDoc.getElementById(exportElementId)
  if (!exportElement) return

  // 4. 为导出元素设置基础样式（确保字体等基础属性）
  exportElement.style.fontFamily = 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  
  // 5. 确保所有 SVG 图标正确显示
  const svgElements = exportElement.querySelectorAll('svg')
  svgElements.forEach((svg) => {
    // 确保 SVG 有正确的显示属性
    if (!svg.style.display) {
      svg.style.display = 'block'
    }
  })
}

/**
 * 导出路线图为图片
 */
export function useExport() {
  /**
   * 将指定元素导出为图片
   * @param elementId 要导出的元素 ID
   * @param filename 文件名（不含扩展名）
   * @param options 导出选项
   */
  async function exportToImage(
    elementId: string,
    filename: string = 'roadmap',
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const mergedOptions = { ...defaultOptions, ...options }
    const element = document.getElementById(elementId)

    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    try {
      // 使用 html2canvas 渲染
      const canvas = await html2canvas(element, {
        scale: mergedOptions.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null, // 使用元素自身的背景色
        logging: false,
        // 在克隆的文档中移除外部样式，避免 oklch 解析错误
        onclone: (clonedDoc) => {
          prepareDocumentForExport(clonedDoc, elementId)
        },
      })

      // 转换为 Blob
      const mimeType =
        mergedOptions.format === 'jpeg' ? 'image/jpeg' : 'image/png'
      const quality =
        mergedOptions.format === 'jpeg' ? mergedOptions.quality : undefined

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('Failed to create image blob')
          }

          // 创建下载链接
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${filename}.${mergedOptions.format}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        },
        mimeType,
        quality
      )
    } catch (error) {
      console.error('Export failed:', error)
      throw error
    }
  }

  /**
   * 获取图片的 Data URL
   * @param elementId 要导出的元素 ID
   * @param options 导出选项
   */
  async function getImageDataUrl(
    elementId: string,
    options: Partial<ExportOptions> = {}
  ): Promise<string> {
    const mergedOptions = { ...defaultOptions, ...options }
    const element = document.getElementById(elementId)

    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    const canvas = await html2canvas(element, {
      scale: mergedOptions.scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      // 在克隆的文档中移除外部样式，避免 oklch 解析错误
      onclone: (clonedDoc) => {
        prepareDocumentForExport(clonedDoc, elementId)
      },
    })

    const mimeType =
      mergedOptions.format === 'jpeg' ? 'image/jpeg' : 'image/png'
    const quality =
      mergedOptions.format === 'jpeg' ? mergedOptions.quality : undefined

    return canvas.toDataURL(mimeType, quality)
  }

  return {
    exportToImage,
    getImageDataUrl,
  }
}
