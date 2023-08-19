import React from "react";
import { graphql } from "gatsby";

import Seo from "../components/Seo";
import { MDXProvider } from "../components/MDXProvider";

interface Props {
  data: Queries.PageMarkdownTemplateQuery
  children: React.ReactNode
}

export const Head = ({ data }: Props) => {
  const p = data.pageMarkdown;
  if (!p) throw new Error(`invalid argument: "pageMarkdown" is undefined`);
  return (
    <Seo
      title={p.title}
      description={p.description ? p.description : undefined}
    />
  );
};

const PageMarkdownTemplate = ({ data, children }: Props) => {
  const p = data.pageMarkdown;
  if (!p) throw new Error(`invalid argument: "pageMarkdown" is undefined`);
  return (
    <MDXProvider>
      <div
        className={"md-root mx-auto" +
          (p.options?.full_width ? "" : " page-width") +
          (p.options?.no_background ? "" : " panel")
        }
      >
        {children}
      </div>
    </MDXProvider>
  );
};

export default PageMarkdownTemplate;

export const query = graphql`
  query PageMarkdownTemplate($id: String!) {
    pageMarkdown(id: { eq: $id }) {
      title
      description
      options {
        full_width
        no_background
      }
    }
  }
`;