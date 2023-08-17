import React from "react"
import ReactDOMServer from "react-dom/server"

export const Tag = ({ tag }: { tag: string }) => (
  <div
    className="flex-none h-fit px-2 py-1 text-xs select-none bg-surface-200 hover:bg-surface-300 border-2 border-surface-100 rounded-lg"
  >
    {tag}
  </div>
)

export const TagNested = ({ nested_tag_label, nested_tags }: { nested_tag_label: string, nested_tags: string[] }) => (
  <a
    className="tooltip-select"
    data-tooltip-html={
      ReactDOMServer.renderToString(
        <div className="max-w-md">
          <TagGroup tags={nested_tags} />
        </div>
      )
    }
  >
    <Tag
      tag={nested_tag_label}
    />
  </a>
)

export const TagGroup = ({ tags, char_limit, tag_limit }: TagGroupProps) => {
  let tags_to_show: string[] = tags;
  let tags_to_nest: string[] = [];
  let nested_tags_label = "";
  // If we can't fit all the tags, add a "+X tags" tag
  if (char_limit) {
    let char_count = 0;
    tags.forEach((tag, idx) => {
      if (char_count + tag.length > char_limit) {
        tags_to_show = tags.slice(0, idx);
        tags_to_nest = tags.slice(idx, tags.length);
        return;
      }
      char_count += tag.length;
    });
  }
  if (tag_limit) {
    while (tags_to_show.length > tag_limit && tags_to_show.length > 0) {
      let tag_to_nest = tags_to_show.pop()!;
      tags_to_nest.unshift(tag_to_nest);
    }
  }
  // Ensure that adding the nested tags label does not exceed the criteria
  if (tags_to_nest.length > 0) {
    nested_tags_label = `+${tags_to_nest.length} tags`;
    if (char_limit) {
      let char_count = tags_to_show.reduce((acc, tag) => acc + tag.length, 0);
      while (char_count + nested_tags_label.length > char_limit && tags_to_show.length > 0) {
        let tag_to_nest = tags_to_show.pop()!;
        char_count -= tag_to_nest.length;
        tags_to_nest.unshift(tag_to_nest);
        nested_tags_label = `+${tags_to_nest.length} tags`;
      }
    }
    if (tag_limit) {
      while (tags_to_show.length + 1 > tag_limit && tags_to_show.length > 0) {
        let tag_to_nest = tags_to_show.pop()!;
        tags_to_nest.unshift(tag_to_nest);
        nested_tags_label = `+${tags_to_nest.length} tags`;
      }
    }
  }
  return (
    <div className="flex flex-row flex-wrap items-center gap-1">
      {tags_to_show.map((tag, idx) => (
        <Tag key={idx} tag={tag} />
      ))}
      {tags_to_nest.length > 0 ? (
        <TagNested nested_tag_label={nested_tags_label} nested_tags={tags_to_nest} />
      ) : null}
    </div>
  )
}