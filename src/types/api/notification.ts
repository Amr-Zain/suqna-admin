export interface Notification {
    id: string
    unread_notifications_count: number
    created_at: string
    read_at: string | null
    type: 'comment' | 'reply' | 'like' | 'rate' | 'report'
    notify_id: number
    title: string
    body: string
}
