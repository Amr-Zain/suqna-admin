import { useAuthStore, UserPermission } from '@/stores/authStore'
import { redirect } from '@tanstack/react-router'

export const checkPermission = (permissionName: string) => {
    const user = useAuthStore.getState().user
    // If user has no permissions or doesn't have the specific permission, redirect
    // Note: We assume if user.permission is missing/empty, they shouldn't access protected routes
    if (!user?.permissions) {
        return true
    }
    if (user?.permissions && !user.permissions.some((p: UserPermission) => p.back_route_name === permissionName)) {
        throw redirect({
            to: '/unauthorized',
        })
    }
}

// Map of route paths to their required permissions
const routePermissionMap: Record<string, string> = {
    '/': 'dashboard.index',
    '/analytics': 'statistic.index',
    '/departments': 'departments.index',
    '/packages': 'packages.index',
    '/qualifications': 'qualifications.index',
    '/bannars': 'bannars.index',
    '/subscriptions': 'subscriptions.index',
    '/settings': 'settings.index',
    '/cities': 'city.index',
    '/countries': 'countries.index',
    '/contacts': 'contacts.index',
    '/terms': 'terms.index',
    '/about': 'about.index',
    '/faqs': 'questions.index',
    '/roles': 'roles.index',
    '/admins': 'admins.index',
    '/providers': 'providers.index',
    '/clients': 'clients.index',
    '/notifications': 'notifications.index',
    '/pages': 'page.index',
    '/social-media': 'socialmedia.index',
    '/profile': 'profile.index',
    '/contact-us': 'contacts.index',
}

/**
 * Check if the current user has permission to access a specific route
 * @param url - The route URL to check
 * @returns true if user has permission, false otherwise
 */
export const hasRoutePermission = (url: string): boolean => {
    const user = useAuthStore.getState().user

    // If no user or no permissions array, deny access
    if (!user?.permissions || !Array.isArray(user.permissions)) {
        return false
    }

    // Get the required permission for this route
    const requiredPermission = routePermissionMap[url]

    // If no permission mapping exists, allow access (for routes that don't require specific permissions)
    if (!requiredPermission) {
        return true
    }

    // Check if user has the required permission
    return user.permissions.some((p: UserPermission) => p.back_route_name === requiredPermission)
}

/**
 * Filter menu items based on user permissions
 * @param items - Array of menu items to filter
 * @returns Filtered array containing only items the user has permission to access
 */
export const filterMenuItemsByPermission = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
        // Check if user has permission for this item
        if (!hasRoutePermission(item.url)) {
            return false
        }

        // If item has children, recursively filter them
        if (item.items && item.items.length > 0) {
            item.items = filterMenuItemsByPermission(item.items)
            // Only include parent if it has at least one accessible child
            return item.items.length > 0
        }

        return true
    })
}
