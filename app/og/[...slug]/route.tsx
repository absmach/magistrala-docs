import { ImageResponse } from "@takumi-rs/image-response";
import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

function OgImage() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #020b18 0%, #052c50 55%, #073763 100%)",
        padding: "80px 120px",
      }}
    >
      <svg
        width={300}
        height={200}
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="75" y="310" width="130" height="130" fill="#ffffff" />
        <rect x="250" y="80" width="130" height="360" fill="#ffffff" />

        <circle cx="500" cy="140" r="60" fill="#ffffff" />
      </svg>

      <div
        style={{
          fontSize: 50,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.2,
          textAlign: "center",
          marginTop: 36,
          maxWidth: 1000,
        }}
      >
        Magistrala — IoT Platform
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: "rgba(255,255,255,0.55)",
          marginTop: 24,
        }}
      >
        Abstract Machines
      </div>
    </div>
  );
}

export async function GET() {
  return new ImageResponse(<OgImage />, {
    width: 1200,
    height: 630,
    format: "webp",
  });
}

export function generateStaticParams() {
  return [
    { slug: ["magistrala", "image.webp"] },
    ...source.getPages().map((page) => ({
      slug: getPageImage(page).segments,
    })),
  ];
}
