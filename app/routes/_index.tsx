import type { MetaFunction } from "@remix-run/node";

import { GridPage } from "~/ui/GridPage";

export const meta: MetaFunction = () => [{ title: "Life Grid" }];

export default function Index() {
  return <GridPage />;
}
