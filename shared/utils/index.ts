/**
 * Shared Utility Functions
 * Type-safe utility functions with modern TypeScript patterns
 */

import type { BaseEntity, CreateInput, UpdateInput } from '../types'

// =============================================================================
// Type Guards & Validation Utilities
// =============================================================================

/**
 * Type-safe check if value is not null or undefined
 */
export const isNotNull = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined
}

/**
 * Type-safe check if value is a non-empty string
 */
export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Type-safe check if value is a valid email
 */
export const isValidEmail = (value: unknown): value is string => {
  return isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/**
 * Type-safe check if value is a valid date
 */
export const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime())
}

/**
 * Type-safe object property existence check
 */
export const hasProperty = <T extends object, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> => {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

// =============================================================================
// String Utilities
// =============================================================================

/**
 * Generate URL-safe slug from string
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Capitalize first letter of each word
 */
export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate initials from name
 */
export const getInitials = (name: string, maxLength = 2): string => {
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('')
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

// =============================================================================
// Date Utilities
// =============================================================================

/**
 * Format date to German locale string
 */
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }
  
  return new Intl.DateTimeFormat('de-DE', { ...defaultOptions, ...options }).format(date)
}

/**
 * Format time to German locale string
 */
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date): string => {
  const rtf = new Intl.RelativeTimeFormat('de-DE', { numeric: 'auto' })
  const now = new Date()
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000)
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2628000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ] as const
  
  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      return rtf.format(diffInSeconds < 0 ? -count : count, interval.label)
    }
  }
  
  return rtf.format(0, 'second')
}

/**
 * Check if date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

/**
 * Get age from birth date
 */
export const calculateAge = (birthDate: Date, referenceDate: Date = new Date()): number => {
  const age = referenceDate.getFullYear() - birthDate.getFullYear()
  const monthDifference = referenceDate.getMonth() - birthDate.getMonth()
  
  if (monthDifference < 0 || (monthDifference === 0 && referenceDate.getDate() < birthDate.getDate())) {
    return age - 1
  }
  
  return age
}

// =============================================================================
// Array Utilities
// =============================================================================

/**
 * Type-safe array grouping
 */
export const groupBy = <T, K extends string | number | symbol>(
  array: readonly T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key]!.push(item)
    return groups
  }, {} as Record<K, T[]>)
}

/**
 * Remove duplicates from array
 */
export const unique = <T>(array: readonly T[]): T[] => {
  return [...new Set(array)]
}

/**
 * Remove duplicates by property
 */
export const uniqueBy = <T, K>(array: readonly T[], keyFn: (item: T) => K): T[] => {
  const seen = new Set<K>()
  return array.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

/**
 * Sort array by property
 */
export const sortBy = <T>(
  array: readonly T[],
  keyFn: (item: T) => string | number | Date,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aValue = keyFn(a)
    const bValue = keyFn(b)
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1
    if (aValue > bValue) return direction === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Chunk array into smaller arrays
 */
export const chunk = <T>(array: readonly T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// =============================================================================
// Object Utilities
// =============================================================================

/**
 * Type-safe object property picker
 */
export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (hasProperty(obj, key as string)) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Type-safe object property omitter
 */
export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> => {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

/**
 * Deep merge objects
 */
export const deepMerge = <T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T => {
  const result = { ...target }
  
  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]
    
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>) as T[Extract<keyof T, string>]
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>]
    }
  }
  
  return result
}

// =============================================================================
// ID Generation Utilities
// =============================================================================

/**
 * Generate random ID
 */
export const generateId = (length = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate UUID v4
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// =============================================================================
// Entity Utilities
// =============================================================================

/**
 * Create new entity with base properties
 */
export const createEntity = <T extends BaseEntity>(
  data: CreateInput<T>
): Omit<T, 'id'> => {
  const now = new Date()
  return {
    ...data,
    createdAt: now,
    updatedAt: now,
    version: 1
  } as Omit<T, 'id'>
}

/**
 * Update entity with new data
 */
export const updateEntity = <T extends BaseEntity>(
  current: T,
  updates: UpdateInput<T>
): T => {
  return {
    ...current,
    ...updates,
    updatedAt: new Date(),
    version: current.version + 1
  }
}

// =============================================================================
// Performance Utilities
// =============================================================================

/**
 * Debounce function execution
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout | null = null
  
  return ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }) as T
}

/**
 * Throttle function execution
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): T => {
  let inThrottle = false
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }) as T
}

/**
 * Measure execution time
 */
export const measureTime = async <T>(
  fn: () => Promise<T> | T,
  label?: string
): Promise<{ result: T; duration: number }> => {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start
  
  if (label) {
    console.log(`${label}: ${duration.toFixed(2)}ms`)
  }
  
  return { result, duration }
}

// =============================================================================
// Error Handling Utilities
// =============================================================================

/**
 * Type-safe error wrapper
 */
export type Result<T, E = Error> = {
  success: true
  data: T
} | {
  success: false
  error: E
}

/**
 * Safely execute async function
 */
export const safeAsync = async <T, E = Error>(
  fn: () => Promise<T>
): Promise<Result<T, E>> => {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error as E }
  }
}

/**
 * Safely execute sync function
 */
export const safe = <T, E = Error>(fn: () => T): Result<T, E> => {
  try {
    const data = fn()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error as E }
  }
}