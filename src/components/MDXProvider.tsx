import React from "react";
import { MDXProvider as MDX } from "@mdx-js/react";

interface Props {
  children: React.ReactNode;
}

const WrapperTableOverflow = (props: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-auto my-4">
    <table {...props} />
  </div>
);

const components = {
  table: WrapperTableOverflow,
};

export const MDXProvider = ({ children }: Props) => (
  <MDX components={components}>
    {children}
  </MDX>
);