<template>
  <div class="border rounded-lg bg-white">
    <!-- Toolbar -->
    <template v-if="editor">
      <div class="border-b p-2 flex flex-wrap gap-1">
        <button
          type="button"
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'bg-gray-200': editor?.isActive('bold') }"
          class="p-2 rounded hover:bg-gray-100 text-sm font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'bg-gray-200': editor.isActive('italic') }"
          class="p-2 rounded hover:bg-gray-100 text-sm italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'bg-gray-200': editor.isActive('underline') }"
          class="p-2 rounded hover:bg-gray-100 text-sm underline"
          title="Underline"
        >
          U
        </button>
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 1 }) }"
          class="p-2 rounded hover:bg-gray-100 text-sm font-bold"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'bg-gray-200': editor.isActive('heading', { level: 2 }) }"
          class="p-2 rounded hover:bg-gray-100 text-sm font-bold"
          title="Heading 2"
        >
          H2
        </button>
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'bg-gray-200': editor.isActive('bulletList') }"
          class="p-2 rounded hover:bg-gray-100 text-sm"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'bg-gray-200': editor.isActive('orderedList') }"
          class="p-2 rounded hover:bg-gray-100 text-sm"
          title="Numbered List"
        >
          1.
        </button>
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          @click="handleImageUpload"
          :disabled="uploading || !editor"
          class="p-2 rounded hover:bg-gray-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload Image"
        >
          <svg
            v-if="!uploading"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span v-else class="text-xs">Uploading...</span>
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileSelect"
        />
      </div>
    </template>

    <!-- Editor Content -->
    <template v-if="editor">
      <EditorContent
        :editor="editor"
        class="p-3 min-h-[120px] focus-within:outline-none cursor-text"
      />
    </template>
    <div
      v-else
      class="p-3 min-h-[120px] flex items-center justify-center text-gray-400"
    >
      Loading editor...
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Image from '@tiptap/extension-image';
import { useAuthStore } from '~/stores/auth';

const model = defineModel()

const authStore = useAuthStore();
const uploading = ref(false);


// Watch for external content changes
const editor = ref<Editor>();
watch(
  model,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value || '');
    }
  }
);

const fileInput = ref<HTMLInputElement | null>(null);
const handleImageUpload = () => {
  fileInput.value?.click();
};

const onFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file || !editor.value) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // Validate file size (e.g., max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    alert('Image size must be less than 5MB');
    return;
  }

  uploading.value = true;

  try {
    // Step 1: Get signed URL from backend
    const { signedUrl, filenameInGCS } = await $fetch('/api/upload/image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
      body: {
        filename: file.name,
        contentType: file.type,
      },
    });

    // Step 2: Upload image to GCS using signed URL
    await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    // step 3: get the image from gcs to display to user
    const imageUrl: string = await $fetch(`/api/images/${filenameInGCS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(imageUrl);

    // Step 4: Insert image into editor
    editor.value.chain().focus().setImage({ src: imageUrl }).run();
  } catch (error: any) {
    console.error('Image upload failed:', error);
    alert(
      error.data?.message || error.statusMessage || 'Failed to upload image'
    );
  } finally {
    uploading.value = false;
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};


// Initialize editor only on client side
onMounted(() => {
  if (import.meta.client) {
    editor.value = new Editor({
      content: model || '',
      extensions: [
        StarterKit,
        Bold,
        Italic,
        Underline,
        Heading,
        BulletList,
        OrderedList,
        ListItem,
        Image.configure({
          inline: true,
          allowBase64: false,
        }),
      ],
      onUpdate({ editor }) {
        model.value = editor.getHTML()
      },
      editorProps: {
        attributes: {
          class: 'prose prose-sm max-w-none focus:outline-none',
        },
      },
    });
  }
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped>
/* Make the editor area more clickable */
:deep(.ProseMirror) {
  outline: none;
  min-height: 120px;
  cursor: text;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Image styling in editor */
:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>
