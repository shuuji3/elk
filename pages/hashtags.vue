<script setup lang="ts">
import TagCardPaginator from '~/components/tag/TagCardPaginator.vue'

import { STORAGE_KEY_HIDE_EXPLORE_TAGS_TIPS } from '~/constants'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

const { client } = useMasto()
const paginator = client.value.v1.followedTags.list({
  limit: 20,
})

const hideExploreTagsTips = useLocalStorage(STORAGE_KEY_HIDE_EXPLORE_TAGS_TIPS, false)

useHydratedHead({
  title: () => t('nav.hashtags'),
})

const { items } = usePaginator(paginator, toRef(() => undefined), undefined)
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/hashtags" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div class="i-ri:hashtag" />
        <span>{{ t('nav.hashtags') }}</span>
      </NuxtLink>
    </template>

    <CommonAlert v-if="items.length === 0 && !hideExploreTagsTips" @close="hideExploreTagsTips = true">
      <i18n-t keypath="tooltip.hashtags_intro" tag="p">
        <NuxtLink
          :to="`/${currentServer}/explore/tags`"
          text-primary hover:underline focus:underline focus:outline-none
        >
          {{ t('tooltip.hashtags_intro_link') }}
        </NuxtLink>
      </i18n-t>
    </CommonAlert>

    <TagCardPaginator v-bind="{ paginator }" />
  </MainContent>
</template>
