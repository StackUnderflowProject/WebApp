export const formatDateString = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    let dayOfWeek = new Intl.DateTimeFormat('sl-SI', { weekday: 'long' }).format(date)

    if (date.toDateString() === today.toDateString()) {
        dayOfWeek = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
        dayOfWeek = 'Yesterday'
    } else if (date.toDateString() === tomorrow.toDateString()) {
        dayOfWeek = 'Tomorrow'
    }

    const day = new Intl.DateTimeFormat('sl-SI', { day: 'numeric' }).format(date)
    const month = new Intl.DateTimeFormat('sl-SI', { month: 'long' }).format(date)
    return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} - ${day} ${month} ${date.getFullYear()}`
}