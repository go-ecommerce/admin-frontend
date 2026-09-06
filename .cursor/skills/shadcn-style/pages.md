# Page templates

Adapt names, routes, and store calls. Do not add unused tabs, Filter, or Export.

## List

```vue
<template>
  <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Заголовок</CardTitle>
            <CardDescription>Короткое описание раздела.</CardDescription>
          </div>
          <Button size="sm" class="h-7 gap-1" @click="router.push({ name: 'entity-create' })">
            <PlusCircle class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Добавить</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          v-model:page="params.page"
          v-model:page-size="params.pageSize"
          :columns="columns"
          :is-loading="isLoading"
          :data="items"
          :total-items="total"
        />
      </CardContent>
    </Card>
  </main>
</template>
```

Reference implementations: `src/views/order/OrderView.vue`, `src/views/category/CategoryView.vue`.

## Create / edit toolbar + split

```vue
<template>
  <div class="p-4 sm:px-6 md:gap-8">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="h-7 gap-1" @click="router.push({ name: 'entity' })">
          <CornerUpLeft class="h-3.5 w-3.5" />
        </Button>
        <span class="text-2xl font-semibold sr-only sm:not-sr-only sm:whitespace-nowrap">
          Новый объект
        </span>
      </div>
      <Button size="sm" class="h-7 gap-1" @click="saveAll">
        <PlusCircle class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Сохранить</span>
      </Button>
    </div>
  </div>
  <main class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
    <div class="col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основные данные</CardTitle>
        </CardHeader>
        <CardContent>
          <!-- domain form -->
        </CardContent>
      </Card>
    </div>
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Дополнительно</CardTitle>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  </main>
</template>
```

Reference: `src/views/category/CreateCategoryView.vue`.

## Form field

```vue
<div class="grid gap-2">
  <Label for="name">Название</Label>
  <Input id="name" v-model="form.name" placeholder="Название" />
</div>
```

Selects: `Select` + `SelectTrigger` + `SelectValue` + `SelectContent` + `SelectItem`. Placeholder must describe the field, not leftover demo text.
