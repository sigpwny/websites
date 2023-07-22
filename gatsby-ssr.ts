import customWrapPageElement from "./src/components/WrapPageElements"
export const wrapPageElement = customWrapPageElement

export const onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: "en" })
}