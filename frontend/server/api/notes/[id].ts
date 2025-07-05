export default eventHandler(async (event): Promise<any> => {
  try {
    const config = useRuntimeConfig()
    const apiBaseURL = config.public.apiBaseURL || 'http://localhost:3001'
    const authHeader = getHeader(event, 'authorization')
    const method = getMethod(event)
    const id = getRouterParam(event, 'id')
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization header required'
      })
    }
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Note ID required'
      })
    }
    
    console.log(`[API] ${method} note ${id}`)
    
    const options: any = {
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    }
    
    // Add body for PUT requests
    if (method === 'PUT') {
      const body = await readBody(event)
      options.body = body
    }
    
    const response = await $fetch(`${apiBaseURL}/api/notes/${id}`, options)
    
    console.log(`[API] ${method} note ${id} successful`)
    return response
    
  } catch (error: any) {
    console.error(`[API] Note operation failed:`, error)
    
    if (error.name === 'FetchError') {
      throw createError({
        statusCode: 503,
        statusMessage: 'Backend service unavailable'
      })
    }
    
    if (error.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }
    
    if (error.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Note not found'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to perform note operation'
    })
  }
}) 