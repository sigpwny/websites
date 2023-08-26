import React from "react";
import { graphql } from "gatsby";

interface Props {
  data: Queries.RedirectClientTemplateQuery;
}

export const Head = ({ data }: Props) => {
  if (!data.redirect || !data.redirect.dst) throw new Error(`invalid argument: "redirect" is undefined`);
  return (
    <>
      <title>Redirecting...</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta httpEquiv="refresh" content={`0; url=${data.redirect.dst}`} />
    </>
  );
};

const RedirectClientTemplate = ({ data }: Props) => {
  if (!data.redirect || !data.redirect.dst) throw new Error(`invalid argument: "redirect" is undefined`);
  return (
    <div className="panel">
      <h1>Redirecting...</h1>
      <p>Click <a href={data.redirect.dst}>here</a> if you are not redirected automatically.</p>
    </div>
  );
};

export default RedirectClientTemplate;

// export const query = graphql`
//   query RedirectClientTemplate($id: String!) {
//     redirect: redirectsJson(id: { eq: $id }) {
//       dst
//     }
//   }
// `;