<template>
  <div class="max-w-2xl mx-auto">
    <div class="card">
      <h1 class="text-2xl font-bold mb-6">Edit Note</h1>
      <form v-if="note" @submit.prevent="handleUpdate" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            maxlength="255"
            class="input-field"
            placeholder="Note title"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <TipTapEditor v-model="form.content" />
        </div>
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="btn-primary"
        >
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </form>
      <div v-else class="text-center text-gray-600">
        Loading note...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/stores/notes'
import { useAuthStore } from '~/stores/auth'
import TipTapEditor from '~/components/TipTapEditor.vue'

const notesStore = useNotesStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const note = computed(() => notesStore.getNoteById(route.params.id as string))

const form = ref({
  title: '',
  content: ''
})

const loading = ref(false)
const error = ref('')

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  if (!note.value) {
    await notesStore.fetchNotes()
  }
  if (note.value) {
    form.value.title = note.value.title
    form.value.content = note.value.content
  }
})

const handleUpdate = async () => {
  loading.value = true
  error.value = ''
  try {
    await notesStore.updateNote(route.params.id as string, form.value)
    router.push(`/notes/${route.params.id}`)
  } catch (err: any) {
    error.value = err.message || 'Failed to update note'
  } finally {
    loading.value = false
  }
}
</script> 