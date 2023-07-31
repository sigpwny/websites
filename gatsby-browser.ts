import "./src/styles/main.css"
import "./src/styles/md.css"
import "./src/styles/prism-one-dark.css";
import "katex/dist/katex.min.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { pdfjs } from "react-pdf";

// https://github.com/wojtekmaj/react-pdf/issues/321#issuecomment-451291757
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import customWrapPageElement from "./src/layouts/WrapPageElements";
export const wrapPageElement = customWrapPageElement;
