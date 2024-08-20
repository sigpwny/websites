import type { HTMLProps } from 'react';
import redirects from '@/redirects.json';

interface Props extends HTMLProps<HTMLAnchorElement> {};

export default function Link({ ...props }: Props) {
  const isRedirect = props.href && props.href in redirects;
  return (
    <a
      data-astro-reload={isRedirect ? "" : undefined}
      {...props}
    />
  );
}