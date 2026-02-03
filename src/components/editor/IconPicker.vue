<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  modelValue: boolean
  selectedIcon: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [icon: string]
}>()

// 搜索关键词
const searchQuery = ref('')

// 常用图标分类
const iconCategories = [
  {
    name: '开发',
    icons: [
      'mdi:code-braces',
      'mdi:language-javascript',
      'mdi:language-typescript',
      'mdi:language-python',
      'mdi:language-html5',
      'mdi:language-css3',
      'mdi:vuejs',
      'mdi:react',
      'mdi:nodejs',
      'mdi:git',
      'mdi:github',
      'mdi:gitlab',
      'mdi:docker',
      'mdi:database',
      'mdi:api',
      'mdi:console',
    ],
  },
  {
    name: '状态',
    icons: [
      'mdi:rocket-launch',
      'mdi:flag',
      'mdi:flag-checkered',
      'mdi:trophy',
      'mdi:medal',
      'mdi:star',
      'mdi:check-circle',
      'mdi:clock-outline',
      'mdi:timer-sand',
      'mdi:progress-check',
      'mdi:thumb-up',
      'mdi:fire',
      'mdi:lightning-bolt',
      'mdi:target',
      'mdi:bullseye-arrow',
      'mdi:chart-line',
    ],
  },
  {
    name: '工作',
    icons: [
      'mdi:file-document-outline',
      'mdi:folder-outline',
      'mdi:clipboard-text',
      'mdi:clipboard-check',
      'mdi:calendar',
      'mdi:calendar-check',
      'mdi:briefcase-outline',
      'mdi:lightbulb-outline',
      'mdi:puzzle-outline',
      'mdi:cog-outline',
      'mdi:wrench',
      'mdi:hammer',
      'mdi:magnify',
      'mdi:pencil',
      'mdi:format-list-checks',
      'mdi:checkbox-marked-circle-outline',
    ],
  },
  {
    name: '设计',
    icons: [
      'mdi:palette',
      'mdi:brush',
      'mdi:draw',
      'mdi:image',
      'mdi:camera',
      'mdi:vector-square',
      'mdi:shape-outline',
      'mdi:format-color-fill',
      'mdi:eye-outline',
      'mdi:layers-outline',
      'mdi:grid',
      'mdi:ruler',
      'mdi:crop',
      'mdi:resize',
      'mdi:monitor',
      'mdi:cellphone',
    ],
  },
  {
    name: '通讯',
    icons: [
      'mdi:email-outline',
      'mdi:message-outline',
      'mdi:chat-outline',
      'mdi:phone-outline',
      'mdi:video-outline',
      'mdi:account-group',
      'mdi:account-outline',
      'mdi:share-variant',
      'mdi:link-variant',
      'mdi:bell-outline',
      'mdi:megaphone',
      'mdi:earth',
      'mdi:web',
      'mdi:wifi',
      'mdi:cloud-outline',
      'mdi:server',
    ],
  },
  {
    name: '安全',
    icons: [
      'mdi:shield-check',
      'mdi:shield-outline',
      'mdi:lock-outline',
      'mdi:lock-open-outline',
      'mdi:key-outline',
      'mdi:fingerprint',
      'mdi:eye-off-outline',
      'mdi:incognito',
      'mdi:security',
      'mdi:verified',
      'mdi:certificate',
      'mdi:shield-lock',
      'mdi:two-factor-authentication',
      'mdi:vpn',
      'mdi:firewall',
      'mdi:bug-outline',
    ],
  },
  {
    name: '箭头',
    icons: [
      'mdi:arrow-right',
      'mdi:arrow-left',
      'mdi:arrow-up',
      'mdi:arrow-down',
      'mdi:chevron-right',
      'mdi:chevron-double-right',
      'mdi:trending-up',
      'mdi:trending-down',
      'mdi:swap-horizontal',
      'mdi:sync',
      'mdi:refresh',
      'mdi:redo',
      'mdi:undo',
      'mdi:transfer',
      'mdi:directions',
      'mdi:navigation',
    ],
  },
  {
    name: '其他',
    icons: [
      'mdi:heart-outline',
      'mdi:bookmark-outline',
      'mdi:tag-outline',
      'mdi:gift-outline',
      'mdi:cake-variant',
      'mdi:party-popper',
      'mdi:weather-sunny',
      'mdi:moon-waning-crescent',
      'mdi:leaf',
      'mdi:flower',
      'mdi:tree',
      'mdi:coffee',
      'mdi:pizza',
      'mdi:music',
      'mdi:gamepad-variant',
      'mdi:emoticon-happy-outline',
    ],
  },
]

// 所有图标扁平列表
const allIcons = computed(() => {
  return iconCategories.flatMap((cat) => cat.icons)
})

// 搜索过滤后的图标
const filteredIcons = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    return null // 返回 null 表示显示分类视图
  }
  return allIcons.value.filter((icon) =>
    icon.toLowerCase().includes(query)
  )
})

// 选择图标
function selectIcon(icon: string) {
  emit('select', icon)
}
</script>

<template>
  <Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-2xl bg-[var(--app-surface)] border-[var(--app-border)]">
      <DialogHeader>
        <DialogTitle class="text-[var(--app-text)]">选择图标</DialogTitle>
      </DialogHeader>

      <!-- Search -->
      <div class="mb-4">
        <Input
          v-model="searchQuery"
          placeholder="搜索图标..."
          class="bg-[var(--app-background)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-secondary)]"
        />
      </div>

      <!-- Search Results -->
      <div v-if="filteredIcons" class="max-h-72 overflow-y-auto">
        <div v-if="filteredIcons.length === 0" class="text-center py-8">
          <p class="text-[var(--app-text-secondary)] text-sm">
            未找到匹配的图标
          </p>
        </div>
        <div v-else class="grid grid-cols-8 gap-1.5">
          <button
            v-for="icon in filteredIcons"
            :key="icon"
            :class="[
              'p-2.5 rounded-lg border-2 transition-all hover:scale-105',
              selectedIcon === icon
                ? 'border-[var(--app-primary)] bg-[var(--app-primary)]/10'
                : 'border-transparent hover:border-[var(--app-border)] hover:bg-[var(--app-surface-elevated)]',
            ]"
            :title="icon"
            @click="selectIcon(icon)"
          >
            <Icon :icon="icon" class="w-5 h-5 text-[var(--app-text)]" />
          </button>
        </div>
      </div>

      <!-- Category View -->
      <div v-else class="max-h-72 overflow-y-auto space-y-4">
        <div
          v-for="category in iconCategories"
          :key="category.name"
        >
          <h4 class="text-xs font-semibold text-[var(--app-text-secondary)] mb-2 uppercase tracking-wider">
            {{ category.name }}
          </h4>
          <div class="grid grid-cols-8 gap-1.5">
            <button
              v-for="icon in category.icons"
              :key="icon"
              :class="[
                'p-2.5 rounded-lg border-2 transition-all hover:scale-105',
                selectedIcon === icon
                  ? 'border-[var(--app-primary)] bg-[var(--app-primary)]/10'
                  : 'border-transparent hover:border-[var(--app-border)] hover:bg-[var(--app-surface-elevated)]',
              ]"
              :title="icon"
              @click="selectIcon(icon)"
            >
              <Icon :icon="icon" class="w-5 h-5 text-[var(--app-text)]" />
            </button>
          </div>
        </div>
      </div>

      <!-- Selected Preview -->
      <div class="mt-4 pt-4 border-t border-[var(--app-border)]">
        <div class="flex items-center gap-3">
          <span class="text-sm text-[var(--app-text-secondary)]">已选择:</span>
          <Badge
            variant="secondary"
            class="bg-[var(--app-primary)]/10 text-[var(--app-primary)] hover:bg-[var(--app-primary)]/15 px-3 py-1.5"
          >
            <Icon :icon="selectedIcon" class="w-4 h-4 mr-1.5" />
            {{ selectedIcon }}
          </Badge>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
