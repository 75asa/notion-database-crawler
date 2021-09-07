import dayjs from 'dayjs'

export const parseISO8601 = (date: Date) => {
  return dayjs(date).format()
}

export const parseDate = (isoString: string) => {
  return dayjs(isoString).toDate()
}
