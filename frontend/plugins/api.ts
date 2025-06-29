export default defineNuxtPlugin((nuxtApp) => {
    const api = $fetch.create({
        baseURL: useRuntimeConfig().public.apiBase as unknown as string
    })

    return {
        provide: {
            api
        }
    }
})