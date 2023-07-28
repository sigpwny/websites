import customWrapPageElement from "./src/layouts/WrapPageElements";
export const wrapPageElement = customWrapPageElement;

export const onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: "en" });
};
