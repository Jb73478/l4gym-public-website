import { PhoenixV3Page } from "@/components/PhoenixV3Page";
import { pageMetadata } from "@/lib/phoenix-v3/pages";

export const metadata = pageMetadata("hub", "de");
export default function Page() {
  return <PhoenixV3Page locale="de" pageKey="hub" />;
}
