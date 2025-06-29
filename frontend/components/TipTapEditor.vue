<template>
  <div>
    <EditorContent :editor="editor" class="border rounded-lg p-2 min-h-[120px] bg-white" />
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
  }
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