<script setup lang="ts">
import type { mastodon } from 'masto'
import diffMatchPatch from 'diff-match-patch'

const {
  status,
  newer,
  withAction = true,
} = defineProps<{
  status: mastodon.v1.Status | mastodon.v1.StatusEdit
  newer?: mastodon.v1.Status
  withAction?: boolean
}>()

/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} HTML representation.
 */
function diffToHtml(diffs: diff_match_patch.Diff[]): string {
  const html = []
  const pattern_amp = /&/g
  const pattern_lt = /</g
  const pattern_gt = />/g
  const pattern_para = /\n/g
  for (let x = 0; x < diffs.length; x++) {
    const op = diffs[x][0] // Operation (insert, delete, equal)
    const data = diffs[x][1] // Text of change.
    const text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
      .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>')
    switch (op) {
      case DIFF_INSERT:
        html[x] = `<ins style="background:#e6ffe6;">${text}</ins>`
        break
      case DIFF_DELETE:
        html[x] = `<del style="background:#ffe6e6;">${text}</del>`
        break
      case DIFF_EQUAL:
        html[x] = `<span>${text}</span>`
        break
    }
  }
  return html.join('')
}

const { translation } = useTranslation(status, getLanguageCode())

const emojisObject = useEmojisFallback(() => status.emojis)
const vnode = $computed(() => {
  const dmp = new diffMatchPatch.diff_match_patch()
  const html = dmp.status.content

  if (!html)
    return null
  const vnode = contentToVNode(html, {
    emojis: emojisObject.value,
    mentions: 'mentions' in status ? status.mentions : undefined,
    markdown: true,
    collapseMentionLink: !!('inReplyToId' in status && status.inReplyToId),
    status: 'id' in status ? status : undefined,
    inReplyToStatus: newer,
  })
  return vnode
})
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': withAction }" relative>
    <span
      v-if="status.content"
      class="content-rich line-compact" dir="auto"
      :lang="('language' in status && status.language) || undefined"
    >
      <component :is="vnode" v-if="vnode" />
    </span>
    <div v-else />
    <template v-if="translation.visible">
      <div my2 h-px border="b base" bg-base />
      <ContentRich v-if="translation.success" class="line-compact" :content="translation.text" :emojis="status.emojis" />
      <div v-else text-red-4>
        Error: {{ translation.error }}
      </div>
    </template>
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
