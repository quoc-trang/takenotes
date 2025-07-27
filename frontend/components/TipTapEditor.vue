<template>
  <div class="border rounded-lg bg-white">
    <!-- Toolbar -->
    <div class="border-b p-2 flex flex-wrap gap-1">
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'bg-gray-200': editor.isActive('bold') }"
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
    </div>
    
    <!-- Editor Content -->
    <EditorContent 
      :editor="editor" 
      class="p-3 min-h-[120px] focus-within:outline-none cursor-text"
    />
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

const editor = new Editor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Bold,
    Italic,
    Underline,
    Heading,
    BulletList,
    OrderedList,
    ListItem
  ],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none',
    },
  },
})

watch(() => props.modelValue, (value) => {
  if (editor.getHTML() !== value) {
    editor.commands.setContent(value)
  }
})

onBeforeUnmount(() => {
  editor.destroy()
})
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
</style> 