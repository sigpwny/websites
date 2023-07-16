import React from "react"

interface TagGroupProps {
  tags: Array<string>,
  char_limit?: number,
  tag_limit?: number
}

export const Tag = ({ tag }: { tag: string }) => (
  <div className="h-fit px-2 py-1 text-xs select-none bg-surface-200 border-2 border-surface-100 rounded-lg">
    {tag}
  </div>
)

/* TODO: use generated tag types */
export const TagGroup = ({ tags, char_limit, tag_limit }: TagGroupProps) => {
  let tags_to_show = tags;
  if (char_limit) {
    let curr_count = 0;
    // Filter tags until we can't fit any more within char_limit
    tags_to_show = tags.filter((tag) => {
      curr_count += tag.length;
      return curr_count <= char_limit;
    });
    curr_count = tags_to_show.reduce((acc, tag) => acc + tag.length, 0);
    // If we can't fit all the tags, add a "+X tags" tag (also make sure we don't go over char_limit)
    if (tags.length > tags_to_show.length) {
      let hidden_tag = `+${tags.length - tags_to_show.length} tags`
      while (hidden_tag.length + curr_count > char_limit && tags_to_show.length > 0) {
        curr_count -= tags_to_show.pop().length;
        hidden_tag = `+${tags.length - tags_to_show.length} tags`
      }
      tags_to_show.push(hidden_tag);
    }
  }
  if (!tag_limit) tag_limit = tags_to_show.length;
  return (
    <div className="flex flex-row items-center gap-1">
      {tags_to_show.slice(0, tag_limit).map((tag, idx) => (
        <Tag key={idx} tag={tag} />
      ))}
    </div>
  )
}