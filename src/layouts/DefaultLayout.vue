<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton as-child class="data-[slot=sidebar-menu-button]:!p-1.5">
              <router-link to="/dashboard">
                <Shell class="!size-6" />
                <span class="text-base font-semibold">Go Store</span>
              </router-link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            <template v-for="item in navMain" :key="item.title">
              <Collapsible
                v-if="item.items?.length"
                as-child
                :default-open="isNavActive(item)"
                class="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton :tooltip="item.title" :is-active="isNavActive(item)">
                      <component :is="item.icon" />
                      <span>{{ item.title }}</span>
                      <ChevronRight
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                        <SidebarMenuSubButton as-child :is-active="isPathActive(subItem.url)">
                          <router-link :to="subItem.url">
                            <span>{{ subItem.title }}</span>
                          </router-link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem v-else>
                <SidebarMenuButton
                  as-child
                  :tooltip="item.title"
                  :is-active="isPathActive(item.url)"
                >
                  <router-link :to="item.url">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarFallback class="rounded-lg">{{ userInitials }}</AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate text-xs">{{ user?.email }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                :side-offset="4"
              >
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarFallback class="rounded-lg">{{ userInitials }}</AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate text-xs">{{ user?.email }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="logout">
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                <BreadcrumbItem :class="{ 'hidden md:block': index < breadcrumbs.length - 1 }">
                  <BreadcrumbLink v-if="index < breadcrumbs.length - 1" :href="breadcrumb.path">
                    {{ breadcrumb.name?.title }}
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else>
                    {{ breadcrumb.name?.title }}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator
                  v-if="index < breadcrumbs.length - 1"
                  class="hidden md:block"
                />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import {
  ChevronRight,
  ChevronsUpDown,
  FolderTree,
  Library,
  LogOut,
  Package,
  Share2,
  Shell,
  ShoppingBag,
  SquareTerminal,
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'

type NavChild = { title: string; url: string }
type NavItem = {
  title: string
  url: string
  icon: typeof SquareTerminal
  items?: NavChild[]
}

const navMain: NavItem[] = [
  { title: 'Обзор', url: '/dashboard', icon: SquareTerminal },
  { title: 'Orders', url: '/order', icon: ShoppingBag },
  { title: 'Categories', url: '/category', icon: FolderTree },
  { title: 'Collections', url: '/collection', icon: Library },
  { title: 'Products', url: '/product', icon: Package },
  {
    title: 'Attributes',
    url: '/attribute',
    icon: Share2,
    items: [
      { title: 'Attribute Group', url: '/attribute-group' },
      { title: 'Attributes', url: '/attribute' },
    ],
  },
]

const { user } = storeToRefs(useAuthStore())
const { logout } = useAuthStore()
const route = useRoute()

const userInitials = computed(() => {
  const local = user.value?.email?.split('@')[0] ?? ''
  if (local.length >= 2) return local.slice(0, 2).toUpperCase()
  return (local[0] ?? '?').toUpperCase()
})

const isPathActive = (url: string) => route.path === url || route.path.startsWith(`${url}/`)

const isNavActive = (item: NavItem) =>
  item.items?.some((sub) => isPathActive(sub.url)) ?? isPathActive(item.url)

const breadcrumbs = computed(() => {
  const matchedRoutes = route.matched
  return matchedRoutes.map((matched) => ({
    name: matched.meta.breadcrumb || matched.name,
    path: matched.path,
  }))
})
</script>

<style scoped></style>
