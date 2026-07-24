import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Rubik } from "next/font/google";
import { EditionSwitcher } from "@/components/edition-switcher";
import { Provider } from "@/components/provider";
import { VersionSwitcher } from "@/components/version-switcher";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import "./global.css";
import { baseUrl, createMetadata } from "@/lib/metadata";
import { CURRENT_VERSION } from "@/lib/versions";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });

export const metadata = createMetadata({
  title: {
    template: "%s | Magistrala",
    default: "Magistrala Docs",
  },
  description:
    "Magistrala is an open-source IoT platform with multi-protocol support (MQTT, CoAP, HTTP, WebSocket), device management, and RBAC — built for cloud and edge.",
  metadataBase: baseUrl,
  openGraph: { url: `${baseUrl}/` },
});

export default function Layout({ children }: LayoutProps<"/">) {
  const base = baseOptions();
  return (
    <html lang="en" className={rubik.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-(family-name:--font-rubik)">
        <Provider>
          <DocsLayout
            {...base}
            tree={source.getPageTree()}
            links={base.links?.filter((item) => item.type === "icon")}
            nav={{ ...base.nav }}
            sidebar={{
              banner: (
                <>
                  <VersionSwitcher />
                  {CURRENT_VERSION === "latest" && <EditionSwitcher />}
                </>
              ),
            }}
          >
            {children}
          </DocsLayout>
        </Provider>
      </body>
    </html>
  );
}
