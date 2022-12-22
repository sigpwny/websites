export function calculateSemester(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  if (month >= 1 && month <= 7) {
    return `SP${year}`
  } else if (month >= 8 && month <= 12) {
    return `FA${year}`
  }
  return "Unknown"
}