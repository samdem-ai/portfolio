import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale } from "@/lib/i18n";

export const alt = "Samy Debaili, cybersecurity engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(hasLocale(lang) ? lang : "en");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#1c1d20", color: "#ffffff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
          <span>© Code by Samy</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>{dict.hero.place}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.55)", marginBottom: 18 }}>
            {dict.hero.role1} {dict.hero.role2}
          </div>
          <div style={{ fontSize: 150, fontWeight: 500, letterSpacing: -7, lineHeight: 1 }}>Samy Debaili</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "rgba(255,255,255,0.7)" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#e5484d" }} />
          Reverse engineering · DFIR · AI red teaming
        </div>
      </div>
    ),
    size,
  );
}
