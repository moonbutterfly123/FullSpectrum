import { ImageResponse } from "next/og";
import { SITE_DOMAIN, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — birds, fish, music and natural history`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #f7f3eb 0%, #efe4d4 45%, #e8d5c0 100%)",
          color: "#1c1917",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "#9a4e2a",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              border: "3px solid #9a4e2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            ◐
          </div>
          {SITE_DOMAIN}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#57534e",
              maxWidth: 820,
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 22,
            color: "#78716c",
          }}
        >
          <span>300+ articles</span>
          <span>•</span>
          <span>Birds · Fish · Music</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
