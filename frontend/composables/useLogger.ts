// Frontend logger composable
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export const useLogger = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const level = isDevelopment ? LogLevel.DEBUG : LogLevel.INFO

  const shouldLog = (logLevel: LogLevel): boolean => {
    return logLevel <= level
  }

  const formatMessage = (level: string, message: string, ...args: any[]): string => {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (args.length > 0) {
      return `${prefix} ${message} ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : arg
      ).join(' ')}`
    }
    
    return `${prefix} ${message}`
  }

  const error = (message: string, ...args: any[]) => {
    if (shouldLog(LogLevel.ERROR)) {
      const formattedMessage = formatMessage('ERROR', message, ...args)
      console.error(formattedMessage)
    }
  }

  const warn = (message: string, ...args: any[]) => {
    if (shouldLog(LogLevel.WARN)) {
      const formattedMessage = formatMessage('WARN', message, ...args)
      console.warn(formattedMessage)
    }
  }

  const info = (message: string, ...args: any[]) => {
    if (shouldLog(LogLevel.INFO)) {
      const formattedMessage = formatMessage('INFO', message, ...args)
      console.info(formattedMessage)
    }
  }

  const debug = (message: string, ...args: any[]) => {
    if (shouldLog(LogLevel.DEBUG)) {
      const formattedMessage = formatMessage('DEBUG', message, ...args)
      console.debug(formattedMessage)
    }
  }

  // Special methods for common frontend events
  const userAction = (action: string, details?: any) => {
    info(`User Action: ${action}`, details)
  }

  const apiCall = (method: string, url: string, status?: number, duration?: number) => {
    const details = { method, url, status, duration }
    if (status && status >= 400) {
      error(`API Call Failed: ${method} ${url}`, details)
    } else {
      debug(`API Call: ${method} ${url}`, details)
    }
  }

  const navigation = (from: string, to: string) => {
    debug(`Navigation: ${from} → ${to}`)
  }

  const errorBoundary = (err: Error, componentInfo?: string) => {
    error(`Error Boundary: ${err.message}`, { 
      stack: err.stack, 
      component: componentInfo 
    })
  }

  return {
    error,
    warn,
    info,
    debug,
    userAction,
    apiCall,
    navigation,
    errorBoundary
  }
} 