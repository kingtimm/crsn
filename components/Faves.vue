<script setup lang="ts">
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'
import { useFaves } from '~/stores/faves';
import { storeToRefs } from 'pinia'

const faveStore = useFaves()
const { refresh, pending } = await faveStore.getStateFromDb()
const { faves, sortState } = storeToRefs(faveStore)
const loadingOrder = ref(true)

const el = ref<HTMLElement | null>(null)
const faveRefs = ref<HTMLElement[] | null>([])
const st = ref([]) as Ref<Array<string>>

// const sortedFavorites = computed(() => {
//   while(pending) {
//     break
//   }
//   if(sortState.value) {
//     const output = sortState.value.map(i => {
//       if(faves.value) {
//         return faves.value[Number(i)]
//       }
//     })
//     return output
//   } else {
//     return faves
//   }
// })

// @ts-ignore this area isn't quite ts ready
const sortableOptions = {
  store: {
    get: () => {
      loadingOrder.value = false
      return sortState.value
    },
    set: async (sortable: any) => await faveStore.storeSortOrder(sortable.toArray()) 
  },
  // onUpdate: (e: any) => {
  //   moveArrayElement(faves, e.oldIndex, e.newIndex)
  //   nextTick(() => {
  //     if (el.value?.children) {
  //       st.value.length = 0
  //       for (const child of el.value?.children) {
  //         for (const attribute of child.attributes) {
  //           if (attribute.name == "data-id") {
  //             st.value.push(attribute.value)
  //           }
  //         }
  //       }
  //     }
  //     console.log('new value', st.value)
  //     faveStore.storeSortOrder(st.value)
  //   })
}


// const ch = ref<HTMLElement | null>(null)

// watch(() => el.value?.firstElementChild?.attributes, (newValue, oldValue) => {
//   console.log(el)
// }, {immediate: true, deep: true})

// @ts-ignore this area isn't quite ts ready
const { option } = useSortable(el, faves, sortableOptions)

</script>

<template>
  <UContainer>
    <h2 class="text-xl leading-10">Favorites List</h2>

    <div class="inline-block" ref="el" v-show="!loadingOrder">
      <div v-for="fave in faves" :key=fave.id :data-id="fave.id"
        class="flex-1 flex fave gap-3 justify-between items-center mb-2 p-2 rounded bg-primary-400/10 ring-1 ring-primary-500/25">
        <UIcon name="i-heroicons-arrows-up-down" />
        <span class="mb-1 flex-grow text-sm">
          {{ fave.firstName?.name }} {{ fave.middleName?.name }} King
        </span>
        <UButton class="h-min" size="2xs" icon="i-heroicons-x-mark-20-solid" @click="faveStore.deleteFave(fave.id)" />
      </div>
    </div>
  </UContainer>
</template>