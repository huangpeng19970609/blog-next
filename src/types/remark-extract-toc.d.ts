declare module "remark-extract-toc" {
  import { Plugin } from "unified";

  interface TocItem {
    value: string;
    depth: number;
    children: TocItem[];
  }

  type TocTree = TocItem[];

  const remarkExtractToc: Plugin;
  export = remarkExtractToc;
}
