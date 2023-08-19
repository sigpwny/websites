interface ProfileBasicProps {
  name: string
  profile_image: ImageDataLike
  handle?: string
  links?: {
    name: string
    url: string
  }[]
  role?: string
}

interface ProfileAdvancedProps extends ProfileBasicProps {
  period?: string
  work?: string
  bio?: string
}

interface AvatarProps {
  profile?: ProfileBasicProps
  label?: string
}

interface AvatarGroupProps {
  profiles: ProfileBasicProps[]
  limit?: number
}

interface AvatarPersonaProps {
  profile: ProfileBasicProps
  children: React.ReactNode
}
