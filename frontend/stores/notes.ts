import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getNotes = computed(() => notes.value)
  const getNoteById = computed(() => (id: string) => notes.value.find(note => note.id === id))
  const isLoading = computed(() => loading.value)

  const fetchNotes = async () => {
    const authStore = useAuthStore()
    if (!authStore.token) return
    
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      notes.value = response
    } catch (err: any) {
      error.value = err.data?.message || err.statusMessage || 'Failed to fetch notes'
    } finally {
      loading.value = false
    }
  }

  const createNote = async (note: { title: string; content: string }) => {
    const authStore = useAuthStore()
    if (!authStore.token) return
    
    try {
      const newNote = await $fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: note
      })
      notes.value.unshift(newNote)
      return newNote
    } catch (err: any) {
      throw new Error(err.data?.message || err.statusMessage || 'Failed to create note')
    }
  }

  const updateNote = async (id: string, note: { title: string; content: string }) => {
    const authStore = useAuthStore()
    if (!authStore.token) return
    
    try {
      const updatedNote = await $fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: note
      })
      
      const index = notes.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      return updatedNote
    } catch (err: any) {
      throw new Error(err.data?.message || err.statusMessage || 'Failed to update note')
    }
  }

  const deleteNote = async (id: string) => {
    const authStore = useAuthStore()
    if (!authStore.token) return
    
    try {
      await $fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      
      notes.value = notes.value.filter(note => note.id !== id)
    } catch (err: any) {
      throw new Error(err.data?.message || err.statusMessage || 'Failed to delete note')
    }
  }

  return {
    // State
    notes,
    loading,
    error,
    
    // Getters
    getNotes,
    getNoteById,
    isLoading,
    
    // Actions
    fetchNotes,
    createNote,
    updateNote,
    deleteNote
  }
}) 