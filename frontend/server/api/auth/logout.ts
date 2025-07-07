export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization header required'
    })
  }

  try {
    const response = await $fetch(`${config.public.apiBaseURL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      }
    })
    
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Logout failed'
    })
  }
}) 