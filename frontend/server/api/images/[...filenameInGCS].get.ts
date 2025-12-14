export default eventHandler(async (event): Promise<any> => {
    const config = useRuntimeConfig()
    const apiBaseURL = config.public.apiBaseURL
    const filenameInGCS = getRouterParam(event, 'filenameInGCS')
    const token = getHeader(event, 'authorization')

    try {
        const { imageUrl } = await $fetch<{imageUrl: string}>(`${apiBaseURL}/api/upload/image`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            query: { filenameInGCS },
        })
        
        return imageUrl
    } catch (error) {
        
    }

})