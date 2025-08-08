/**
 * Card Component
 * Flexible card component with header, content, and footer sections
 */

import React, { forwardRef } from 'react'

import { cn } from '@/lib/utils'

// =============================================================================
// Card Component
// =============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border text-card-foreground',
          {
            'bg-card shadow-sm': variant === 'default',
            'border-2': variant === 'outline',
            'border-transparent shadow-none': variant === 'ghost'
          },
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

// =============================================================================
// Card Header Component
// =============================================================================

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, divider = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5 p-6',
          divider && 'border-b',
          className
        )}
        {...props}
      />
    )
  }
)

CardHeader.displayName = 'CardHeader'

// =============================================================================
// Card Title Component
// =============================================================================

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'text-2xl font-semibold leading-none tracking-tight',
          className
        )}
        {...props}
      />
    )
  }
)

CardTitle.displayName = 'CardTitle'

// =============================================================================
// Card Description Component
// =============================================================================

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      />
    )
  }
)

CardDescription.displayName = 'CardDescription'

// =============================================================================
// Card Content Component
// =============================================================================

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, noPadding = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(!noPadding && 'p-6 pt-0', className)}
        {...props}
      />
    )
  }
)

CardContent.displayName = 'CardContent'

// =============================================================================
// Card Footer Component
// =============================================================================

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, divider = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center p-6 pt-0',
          divider && 'border-t pt-6',
          className
        )}
        {...props}
      />
    )
  }
)

CardFooter.displayName = 'CardFooter'

// =============================================================================
// Interactive Card Component
// =============================================================================

export interface InteractiveCardProps extends CardProps {
  onClick?: () => void
  href?: string
  disabled?: boolean
}

export const InteractiveCard = forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ className, onClick, href, disabled = false, children, ...props }, ref) => {
    const isInteractive = Boolean(onClick || href)
    
    const cardContent = (
      <Card
        ref={ref}
        className={cn(
          isInteractive && !disabled && [
            'cursor-pointer transition-all duration-200',
            'hover:shadow-md hover:scale-[1.02]',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          ],
          disabled && 'opacity-60 cursor-not-allowed',
          className
        )}
        onClick={disabled ? undefined : onClick}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        onKeyDown={
          onClick && !disabled
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick()
                }
              }
            : undefined
        }
        {...props}
      >
        {children}
      </Card>
    )

    if (href && !disabled) {
      return (
        <a href={href} className="block">
          {cardContent}
        </a>
      )
    }

    return cardContent
  }
)

InteractiveCard.displayName = 'InteractiveCard'

// =============================================================================
// Card Image Component
// =============================================================================

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait'
  position?: 'top' | 'bottom'
}

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, aspectRatio, position = 'top', alt, ...props }, ref) => {
    return (
      <div
        className={cn(
          'overflow-hidden',
          position === 'top' && 'rounded-t-lg',
          position === 'bottom' && 'rounded-b-lg',
          {
            'aspect-square': aspectRatio === 'square',
            'aspect-video': aspectRatio === 'video',
            'aspect-[3/1]': aspectRatio === 'wide',
            'aspect-[3/4]': aspectRatio === 'portrait'
          }
        )}
      >
        <img
          ref={ref}
          alt={alt}
          className={cn(
            'h-full w-full object-cover transition-all duration-300 hover:scale-105',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

CardImage.displayName = 'CardImage'

// =============================================================================
// Card Badge Component
// =============================================================================

export interface CardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const CardBadge = forwardRef<HTMLDivElement, CardBadgeProps>(
  ({ className, position = 'top-right', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-10',
          {
            'top-2 left-2': position === 'top-left',
            'top-2 right-2': position === 'top-right',
            'bottom-2 left-2': position === 'bottom-left',
            'bottom-2 right-2': position === 'bottom-right'
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardBadge.displayName = 'CardBadge'

// =============================================================================
// Card Stack Component (for grouped cards)
// =============================================================================

export interface CardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'sm' | 'md' | 'lg'
  direction?: 'vertical' | 'horizontal'
}

export const CardStack = forwardRef<HTMLDivElement, CardStackProps>(
  ({ className, spacing = 'md', direction = 'vertical', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
          {
            'gap-2': spacing === 'sm',
            'gap-4': spacing === 'md',
            'gap-6': spacing === 'lg'
          },
          className
        )}
        {...props}
      />
    )
  }
)

CardStack.displayName = 'CardStack'

// =============================================================================
// Export all components
// =============================================================================

export default Card