import { ImageResponse } from "next/og";

export const alt = "Brian Cabrera. Software engineer and data systems developer.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social preview card. Kept close to the site: near-black, thin borders,
// cyan accents, no gradient soup.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#05070c",
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          color: "white",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid rgba(103,232,249,0.25)",
            backgroundColor: "rgba(3,10,16,0.85)",
            padding: "56px 64px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#67e8f9",
            }}
          >
            briancabrera.io
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Brian Cabrera
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              color: "#a1a1aa",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Data / Code / Systems
          </div>

          <div
            style={{
              marginTop: 40,
              display: "flex",
              gap: 16,
              fontSize: 22,
              color: "#67e8f9",
            }}
          >
            <div
              style={{
                border: "1px solid rgba(103,232,249,0.35)",
                padding: "8px 18px",
              }}
            >
              Software Engineer
            </div>
            <div
              style={{
                border: "1px solid rgba(103,232,249,0.35)",
                padding: "8px 18px",
              }}
            >
              Data Systems
            </div>
            <div
              style={{
                border: "1px solid rgba(103,232,249,0.35)",
                padding: "8px 18px",
              }}
            >
              Full-Stack
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
