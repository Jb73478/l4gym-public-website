import { PhoenixV3Page } from "@/components/PhoenixV3Page";
import { pageMetadata } from "@/lib/phoenix-v3/pages";

export const metadata = pageMetadata("hub", "en");
export default function Page() {
  return <PhoenixV3Page locale="en" pageKey="hub" />;
}
