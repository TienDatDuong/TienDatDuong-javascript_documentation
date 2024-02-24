<script setup lang="ts">
import { computed, CSSProperties, ref, unref, useSlots } from 'vue';
import { useRoute } from 'vue-router';

import { useContentHeight } from '@/hooks/web';

defineOptions({
  name: 'PageWrapper'
});

interface PageWrapperProps {
  title?: string;
  loading?: boolean;
  contentFullHeight?: boolean;
  fixedHeight?: boolean;
}

const props = withDefaults(defineProps<PageWrapperProps>(), {
  contentFullHeight: true,
  fixedHeight: true
});
const slots = useSlots();
const route = useRoute();

const wrapperRef = ref(null);
const pageHeaderRef = ref(null);
const contentHeaderRef = ref(null);
const contentWrapperRef = ref(null);
const contentRef = ref(null);

const getIsContentFullHeight = computed(() => {
  return props.contentFullHeight;
});

const { contentHeight } = useContentHeight(
  getIsContentFullHeight,
  wrapperRef,
  [pageHeaderRef, contentHeaderRef],
  [contentRef, contentWrapperRef]
);

const getContentStyle = computed((): CSSProperties => {
  const { contentFullHeight, fixedHeight } = props;
  if (!contentFullHeight) {
    return {};
  }

  const height = `${unref(contentHeight)}px`;
  return {
    minHeight: height,
    ...(fixedHeight ? { height } : {})
  };
});

const isShowContentHeader = computed(() => props.title || slots['header'] || slots['header-extra']);
</script>

<template>
  <div ref="wrapperRef">
    <div v-loading="loading">
      <div v-if="$slots['page-header']" ref="pageHeaderRef" class="px-[24px] py-[16px] bg-white dark:bg-dark">
        <slot name="page-header" />
      </div>
      <div ref="contentWrapperRef" class="m-[16px] p-[10px] bg-white dark:bg-dark rounded-[12px] shadow-sm">
        <div
          v-if="isShowContentHeader"
          ref="contentHeaderRef"
          class="flex items-center pb-[10px] border-b border-gray-200"
        >
          <div class="flex-1 min-w-0">
            <slot name="header">
              <h5 class="m-0">{{ title || route.meta.title }}</h5>
            </slot>
          </div>
          <div class="flex">
            <slot name="header-extra" />
          </div>
        </div>
        <div ref="contentRef" class="overflow-x-hidden p-[10px]" :style="getContentStyle">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
