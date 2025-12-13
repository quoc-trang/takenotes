<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Notes</h1>
        <p class="text-gray-600 mt-2">Manage and organize your thoughts</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary flex items-center gap-2"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        New Note
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="notesStore.isLoading"
      class="flex justify-center items-center py-12"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="notesStore.error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg
          class="w-16 h-16 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
        </svg>
        <p class="text-lg font-semibold">{{ notesStore.error }}</p>
      </div>
      <button @click="notesStore.fetchNotes()" class="btn-secondary">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="notesStore.getNotes.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg
          class="w-24 h-24 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <p class="text-xl font-semibold">No notes yet</p>
        <p class="text-gray-500 mt-2">Create your first note to get started</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        Create Your First Note
      </button>
    </div>

    <!-- Notes Grid -->
    <div v-else class="grid grid-cols-1 gap-6 cursor-pointer" >
      <div
        v-for="note in notesStore.getNotes"
        :key="note.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
      >
        <div class="p-6" @click="toggleNote(note.id)">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-gray-900 line-clamp-2">
              {{ note.title }}
            </h3>
            <div class="flex gap-2">
              <button
                @click="editNote(note)"
                class="text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit note"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
              <button
                @click="deleteNote(note.id)"
                class="text-gray-400 hover:text-red-600 transition-colors"
                title="Delete note"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div
            class="mb-4 overflow-hidden transition-[max-height] duration-300 ease-in-out"
            :style="expandedNotes.has(note.id) ? 'max-height: 800px' : 'max-height: 72px'"
          >
            <p
              class="text-gray-600 transition-all duration-500"
              :class="expandedNotes.has(note.id) ? '' : 'line-clamp-3'"
              v-html="note.content"
            ></p>
          </div>

          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ formatDate(note.updatedAt) }}</span>
            <button
              class="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
            >
              {{ expandedNotes.has(note.id) ? 'Show less' : 'Show more' }}
              <svg
                class="w-4 h-4 transition-transform duration-300"
                :class="{ 'rotate-180': expandedNotes.has(note.id) }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Note Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h2 class="text-xl font-semibold mb-4">Create New Note</h2>

        <form @submit.prevent="createNote">
          <div class="mb-4">
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              v-model="newNote.title"
              type="text"
              required
              class="input-field"
              placeholder="Enter note title"
            />
          </div>

          <div class="mb-6">
            <label
              for="content"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              v-model="newNote.content"
              required
              rows="4"
              class="input-field resize-none"
              placeholder="Enter note content"
            ></textarea>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="showCreateModal = false"
              class="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="btn-primary flex-1 disabled:opacity-50"
            >
              {{ creating ? 'Creating...' : 'Create Note' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '@/stores/notes';
import { useAuthStore } from '@/stores/auth';

const notesStore = useNotesStore();
const authStore = useAuthStore();
const router = useRouter();

// Modal state
const showCreateModal = ref(false);
const creating = ref(false);

// Accordion state - track expanded notes by ID
const expandedNotes = ref<Set<string>>(new Set());

// Toggle note expansion
const toggleNote = (noteId: string) => {
  if (expandedNotes.value.has(noteId)) {
    expandedNotes.value.delete(noteId);
  } else {
    expandedNotes.value.add(noteId);
  }
};

// New note form
const newNote = ref({
  title: '',
  content: '',
});

// Fetch notes on page load
onMounted(async () => {
  if (authStore.isLoggedIn) {
    await notesStore.fetchNotes();
  }
});

// Create new note
const createNote = async () => {
  if (!newNote.value.title.trim() || !newNote.value.content.trim()) return;

  creating.value = true;
  try {
    await notesStore.createNote({
      title: newNote.value.title.trim(),
      content: newNote.value.content.trim(),
    });

    // Reset form and close modal
    newNote.value = { title: '', content: '' };
    showCreateModal.value = false;
  } catch (error: any) {
    console.error('Failed to create note:', error);
    alert(error.message || 'Failed to create note');
  } finally {
    creating.value = false;
  }
};

// Edit note
const editNote = (note: any) => {
  router.push(`/notes/${note.id}/edit`);
};

// Delete note
const deleteNote = async (id: string) => {
  if (!confirm('Are you sure you want to delete this note?')) return;

  try {
    await notesStore.deleteNote(id);
  } catch (error: any) {
    console.error('Failed to delete note:', error);
    alert(error.message || 'Failed to delete note');
  }
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
