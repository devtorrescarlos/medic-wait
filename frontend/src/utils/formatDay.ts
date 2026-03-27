export const formatDay = (day: string) => {
    return day.at(0)?.toUpperCase() + day.slice(1)
}