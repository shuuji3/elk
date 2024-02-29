<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

const { client } = useMasto()
const paginator = client.value.v1.followedTags.list({
  limit: 20,
})

useHydratedHead({
  title: () => t('nav.followed_tags'),
})

const ordering = ref<'alphabetical' | 'chronological'>('alphabetical')

function toggleOrdering() {
  if (ordering.value === 'alphabetical')
    ordering.value = 'chronological'
  else
    ordering.value = 'alphabetical'
}
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/followed-tags" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div class="i-ri:hashtag" />
        <span>{{ t('nav.followed_tags') }}</span>
      </NuxtLink>
    </template>

    <template #actions>
      <button
        flex rounded-4 p2
        hover:bg-active cursor-pointer transition-100
        :title="t('settings.notifications.show_btn')"
      >
        <span
          aria-hidden="true"
          :class="ordering === 'alphabetical' ? 'i-ri:sort-alphabet-asc' : 'i-ri:sort-number-asc'"
          @click="toggleOrdering"
        />
      </button>
    </template>

    <TagCardPaginator v-bind="{ paginator }" />
  </MainContent>
</template>
