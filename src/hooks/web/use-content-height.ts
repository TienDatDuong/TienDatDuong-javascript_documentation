import { ComputedRef, Ref, ref } from "vue";

export function useContentHeight(
    flag: ComputedRef<Boolean>,
    anchorRef: Ref,
    subtractHeightRefs: Ref[],
    substractSpaceRefs: Ref[],
    downwardClass = '',
    offsetHeight = 0
  ) {
    const contentHeight = ref<number>(0);
  
    const { height: winHeight } = useWindowSize();
  
    function getEl(element: any): Nullable<HTMLDivElement> {
      if (element === null) {
        return null;
      }
      return (element instanceof HTMLDivElement ? element : element.$el) as HTMLDivElement;
    }
  
    function calcSubtractSpace(element: Element | null | undefined, direction: 'all' | 'top' = 'all'): number {
      function numberPx(px: string) {
        return Number(px.replace(/[^\d]/g, ''));
      }
      let subtractHeight = 0;
      const ZERO_PX = '0px';
      if (element) {
        const cssStyle = getComputedStyle(element);
        const marginTop = numberPx(cssStyle?.marginTop ?? ZERO_PX);
        const paddingTop = numberPx(cssStyle?.paddingTop ?? ZERO_PX);
        if (direction === 'all') {
          subtractHeight += marginTop;
          subtractHeight += paddingTop;
        } else {
          subtractHeight += marginTop;
          subtractHeight += paddingTop;
        }
      }
      return subtractHeight;
    }
  
    async function calcContentHeight() {
      if (!flag.value) return;
  
      const anchorEl = getEl(unref(anchorRef));
      if (!anchorEl) return;
  
      const { top } = useElementBounding(anchorEl);
      const bottomIncludeBody = unref(winHeight) - unref(top);
  
      let substractHeight = 0;
      subtractHeightRefs.forEach(item => {
        substractHeight += getEl(unref(item))?.offsetHeight ?? 0;
      });
  
      let substractSpaceHeight = calcSubtractSpace(anchorEl) ?? 0;
  
      substractSpaceRefs.forEach(item => {
        substractSpaceHeight += calcSubtractSpace(getEl(unref(item)));
      });
  
      // downward
      let downwardHeight = 0;
      function downward(element: Element | null, downwardClass: string) {
        if (element && downwardClass) {
          const headEl = element.querySelector(downwardClass) as HTMLElement;
          downwardHeight += headEl?.offsetHeight ?? 0;
        }
      }
      downward(anchorEl, downwardClass);
  
      const height = bottomIncludeBody - substractHeight - substractSpaceHeight - downwardHeight - offsetHeight;
  
      contentHeight.value = height;
    }
  
    const debouncedFn = useDebounceFn(() => {
      calcContentHeight();
    }, 100);
  
    window.addEventListener('resize', debouncedFn);
  
    onMountedOrActivated(() => {
      nextTick(() => {
        calcContentHeight();
      });
    });
  
    return { contentHeight };
  }
  