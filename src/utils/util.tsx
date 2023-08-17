import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import advanced from "dayjs/plugin/advancedFormat"

export function weekNumber(week_number: number): string {
  return (week_number).toLocaleString(undefined, {minimumIntegerDigits: 2})
}

export function calculateSemester(input_date: string): string {
  const date = dayjs(input_date)
  const year = date.year()
  const month = date.month() + 1
  if (month >= 1 && month <= 7) {
    return `SP${year}`
  } else {
    return `FA${year}`
  }
}

export function formatSemester(semester: string): string {
  const season = semester.slice(0, 2)
  const year = semester.slice(2, 6)
  if (season === "SP") {
    return `Spring ${year}`
  } else if (season === "FA") {
    return `Fall ${year}`
  } else if (season === "SU") {
    return `Summer ${year}`
  } else if (season === "WI") {
    return `Winter ${year}`
  }
  return semester
}

export function convertDate(input_date: string, format?: string, input_tz?: string): string {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(advanced);
  const date = input_tz ? dayjs(input_date).tz(input_tz) : dayjs(input_date);
  if (format) {
    return date.format(format);
  }
  return date.toISOString();
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

export function getYouTubeVideoId(url: string): string {
  const regex_video = /^.*(youtu.be\/|youtube(-nocookie)?.com\/(v\/|.*u\/\w\/|embed\/|.*v=))([\w-]{11}).*/
  const match_video = url.match(regex_video)

  if (match_video && match_video[4].length === 11) {
    return match_video[4]
  }
  return ""
}