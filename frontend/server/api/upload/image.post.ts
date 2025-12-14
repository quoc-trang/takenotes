export default eventHandler(async (event): Promise<any> => {
    try {
        const config = useRuntimeConfig()
        const apiBaseURL = config.public.apiBaseURL

        const token = getHeader(event, 'authorization');

        const body = await readBody(event)
        const {filename, contentType} = body

        // get the signed url from backend
        const  { signedUrl, filenameInGCS }  = await $fetch(`${apiBaseURL}/api/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: {
                filename,
                contentType
            }
        })

        return { signedUrl, filenameInGCS}
        
    } catch (error) {
        
    }
})