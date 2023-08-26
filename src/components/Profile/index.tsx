import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GatsbyImage,
  getImage,
  IGatsbyImageData
} from "gatsby-plugin-image";
import { ChevronDownSvg, getSocialIcon } from "../Icons";

function calculateInitials(name: string) {
  const names = name.split(" ");
  if (names.length === 1) {
    return names[0][0];
  } else {
    return names[0][0] + names[names.length - 1][0];
  }
}

export const Avatar = ({ profile, label }: AvatarProps) => {
  if (profile && getImage(profile.profile_image)) {
    return (
      <div className="flex flex-shrink-0 flex-grow-0 rounded-full overflow-hidden border-surface-200 border-2 bg-surface-100 select-none">
        <GatsbyImage
          image={getImage(profile.profile_image) as IGatsbyImageData}
          alt={profile.name}
          className="w-full h-full"
        />
      </div>
    );
  } else if (label || (profile && profile.name)) {
    const text_content = label ?? calculateInitials(profile!.name);
    return (
      <div className="flex flex-shrink-0 flex-grow-0 rounded-full overflow-hidden border-surface-200 border-2 bg-surface-100 w-full h-full items-center justify-center text-sm select-none">
        {text_content}
      </div>
    );
  }
  return null;
};

export const AvatarGroup = ({ profiles, limit }: AvatarGroupProps) => {
  const show_count = limit && profiles.length > limit ? limit - 1 : profiles.length;
  const shown_profiles = profiles.slice(0, show_count);
  const nested_profiles = profiles.slice(show_count, profiles.length);
  const nested_label = `+${nested_profiles.length}`;
  return (
    <div className="grid h-8 gap-1" style={{gridTemplateColumns: `repeat(${limit ?? profiles.length}, 2rem)`}}>
      {shown_profiles.map((profile, idx) => (
        <span
          key={idx}
          className="profile-tooltip-select w-full h-full"
          data-tooltip-content={JSON.stringify(profile)}
        >
          <Avatar profile={profile} />
        </span>
      ))}
      {nested_profiles.length > 0 && (
        <Avatar label={nested_label} />
      )}
    </div>
  );
};

export const AvatarPersona = (props: AvatarPersonaProps) => {
  const { profile, children } = props;
  return (
    <div className="flex flex-row gap-1 items-center">
      <div className="flex flex-shrink-0 flex-grow-0 w-8 h-8">
        <span
          className="profile-tooltip-select w-full h-full"
          data-tooltip-content={JSON.stringify(profile)}
        >
          <Avatar profile={profile} />
        </span>
      </div>
      <div className="flex flex-row items-center">
        {children}
      </div>
    </div>
  );
};

export const ProfileCard = ({ profile }: { profile: ProfileBasicProps }) => (
  <div className="flex flex-row gap-4 bg-surface-250 border-surface-300 border-2 rounded-xl isolate overflow-hidden p-4 relative bottom-0 right-0 max-h-fit max-w-fit">
    {profile?.profile_image ? (
      <div className="w-32 h-32">
        <Avatar profile={profile} />
      </div>
    ) : null}
    <div className="self-center">
      {profile?.role ? (
        <p className="font-mono font-bold text-primary uppercase m-0">
          {profile.role}
        </p>
      ) : null}
      {profile?.name ? (
        <p className="2xl:text-3xl text-2xl font-bold m-0">
          {profile.name}
        </p>
      ) : null}
      {profile?.handle ? (
        <p className={`font-mono mb-1`}>
          @{profile.handle}
        </p>
      ) : null}
      {profile?.links ? (
        <div>
          <ProfileCard.Links profile={profile} />
        </div>
      ) : null}
    </div>
  </div>
);

ProfileCard.Links = ({ profile }: { profile: ProfileBasicProps }) => (
  <>
    {profile && profile.links?.map((link, idx) => {
      const social = getSocialIcon(link.name);
      if (!social) return null;
      if (link.url === "") return null;
      const url = link.name === "email" ? `mailto:${link.url}` : link.url;
      return (
        <a
          key={idx}
          href={url}
          title={social.display}
          className="mr-2"
          target="_blank" rel="noopener noreferrer"
        >
          {social.svg}
        </a>
      );
    })}
  </>
);

export const ProfileCardGrid = ({ profiles }: { profiles: ProfileAdvancedProps[] }) => {
  const [expanded_profiles, setIsExpanded] =
    useState(Array(profiles.length).fill(false));
  const handleSetIsExpanded = (index: number) => {
    const new_expanded_profiles = [...expanded_profiles];
    new_expanded_profiles[index] = !new_expanded_profiles[index];
    setIsExpanded(new_expanded_profiles);
  };
  return (
    <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
      {profiles.map((profile, idx) => {
        const isExpanded = expanded_profiles[idx]
        return (
          <motion.div
            key={idx}
            layout="position"
            transition={{ duration: 0.0 }}
            className="bg-surface-100 rounded-xl isolate overflow-hidden p-4 relative bottom-0 right-0"
          >
            {/* Profile content */}
            <motion.div layout className={`flex gap-4 md:flex-row ${isExpanded ? "flex-col" : "flex-row"}`}>
              {getImage(profile?.profile_image) ? (
                <motion.div
                  layout
                  className={`md:basis-1/3 shrink-0 select-none ${isExpanded ? "w-48" : "w-16"}`}
                >
                  <GatsbyImage
                    image={getImage(profile.profile_image) as IGatsbyImageData}
                    alt={`${profile.name} profile picture`}
                    className="rounded-full inline-block flex-1"
                  />
                </motion.div>
              ) : null}
              <div className="self-center w-full">
                {profile?.role ? (
                  <motion.p layout className="font-mono font-bold text-primary uppercase m-0">
                    {profile.role}
                  </motion.p>
                ) : null}
                {profile?.name ? (
                  <motion.p layout className="2xl:text-3xl text-2xl font-bold m-0">
                    {profile.name}
                  </motion.p>
                ) : null}
                {profile?.handle ? (
                  <p className={`font-mono mb-1 ${isExpanded ? "" : "max-md:hidden"}`}>
                    @{profile.handle}
                  </p>
                ) : null}
                {profile?.period ? (
                  <p className={`italic mb-1 ${isExpanded ? "" : "max-md:hidden"}`}>
                    {profile.period}
                  </p>
                ) : null}
                {profile?.work ? (
                  <p className={`mb-1 ${isExpanded ? "" : "max-md:hidden"}`}>
                    {profile.work}
                  </p>
                ) : null}
                {profile?.links ? (
                  <div className={isExpanded ? "" : "max-md:hidden"}>
                    <ProfileCard.Links profile={profile} />
                  </div>
                ) : null}
              </div>
            </motion.div>
            {profile?.bio ? (
              <div className={`flex flex-row mt-4 ${isExpanded ? "" : "max-md:hidden"}`}>
                <p className="m-0">
                  {profile.bio}
                </p>
              </div>
            ) : null}
            {/* Expand/minimize button: only shows on mobile */}
            <span className="absolute top-8 right-4 md:hidden">
              <button title="Expand profile" onClick={() => handleSetIsExpanded(idx)}>
                <motion.div
                  layout
                  animate={{ rotate: isExpanded ? 180 : 0, transition: { ease: "easeInOut" } }}
                  className="inline-block"
                >
                  <ChevronDownSvg height={32} width={32} />
                </motion.div>
              </button>
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
