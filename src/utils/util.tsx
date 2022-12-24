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

export function weekNumber(week_number: number): string {
  return (week_number).toLocaleString(undefined, {minimumIntegerDigits: 2})
}

export function getYouTubeEmbedUrl(url: string): string {
  const regex_video = /^.*(youtu.be\/|youtube(-nocookie)?.com\/(v\/|.*u\/\w\/|embed\/|.*v=))([\w-]{11}).*/
  const regex_playlist = /^.*(?:(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))|youtube(-nocookie)?\.com\/playlist\?).*(?:list=)([\w-]*).*/
  const match_video = url.match(regex_video)
  const match_playlist = url.match(regex_playlist)

  if (match_video && match_video[4].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match_video[4]}`
  } else if (match_playlist && match_playlist[2].length === 34) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${match_playlist[2]}`
  }
  return ""
}