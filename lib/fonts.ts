import { Albert_Sans, JetBrains_Mono } from "next/font/google";

const sans = Albert_Sans({ subsets: ["latin"], variable: "--font-albert" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains" });

export const fontVariables = `${sans.variable} ${mono.variable}`;
