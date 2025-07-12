<template>
  <div class="max-w-2xl mx-auto">
    <div class="card">
      <h1 class="text-2xl font-bold mb-6">Create New Note</h1>
      <form @submit.prevent="handleCreate" class="space-y-4">
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
          {{ loading ? 'Saving...' : 'Save Note' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '@/stores/notes'

definePageMeta({
  middleware: 'auth'
})

const notesStore = useNotesStore()
const router = useRouter()

const form = ref({
  title: '',
  content: ''
})

const loading = ref(false)
const error = ref('')

const handleCreate = async () => {
  loading.value = true
  error.value = ''
  try {
    await notesStore.createNote(form.value)
    router.push('/notes')
  } catch (err: any) {
    error.value = err.message || 'Failed to create note'
  } finally {
    loading.value = false
  }
}
</script> 