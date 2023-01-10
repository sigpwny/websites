import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { graphql, useStaticQuery } from "gatsby"

export function weekNumber(week_number: number): string {
  return (week_number).toLocaleString(undefined, {minimumIntegerDigits: 2})
}

export function calculateSemester(input_date: string): string {
  const date = dayjs(input_date)
  const year = date.year()
  const month = date.month() + 1
  if (month >= 1 && month <= 7) {
    return `SP${year}`
  } else if (month >= 8 && month <= 12) {
    return `FA${year}`
  }
  return "Unknown"
}

export function convertDate(input_date: string, format: string, local_tz: string): string {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  let date
  if (local_tz) {
    date = dayjs(input_date).tz(local_tz)
  } else {
    date = dayjs(input_date)
  }
  if (format) {
    return date.format(format)
  }
  return date.toISOString()
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