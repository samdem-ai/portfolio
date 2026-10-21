import type { L } from "@/lib/i18n";

export type Specimen = {
  name: string;
  alias: string;
  type: string;
  behaviour: L;
  iocs: string[];
  /** My ATT&CK mapping of the behaviour described in the report. */
  attack: { id: string; name: string }[];
  /** Slug of the content/work post that covers this sample, if any. */
  writeup?: string;
};

export const specimens: Specimen[] = [
  {
    name: "Ransomware.WannaCry.Win32",
    alias: "Ransomware.WannaCry.exe.malz",
    type: "Ransomware",
    behaviour: {
      en: "Checks a kill-switch domain, encrypts with CryptoAPI, spreads as an SMB worm and talks over Tor.",
      fr: "Vérifie un domaine kill switch, chiffre via CryptoAPI, se propage en ver SMB et communique via Tor.",
    },
    iocs: ["kill-switch domain", "SMB/445", "Tor"],
    attack: [
      { id: "T1486", name: "Data Encrypted for Impact" },
      { id: "T1210", name: "Exploitation of Remote Services" },
      { id: "T1090.003", name: "Multi-hop Proxy" },
    ],
  },
  {
    name: "Injector.WerFlt.Win32",
    alias: "Malware.stage0.exe.malz",
    type: "Injector",
    behaviour: {
      en: "C/GCC stage-0 that injects into WerFault.exe with CreateRemoteThread, then opens a reverse shell.",
      fr: "Stage-0 en C/GCC qui s'injecte dans WerFault.exe via CreateRemoteThread, puis ouvre un reverse shell.",
    },
    iocs: ["WerFault.exe", "TCP/8443"],
    attack: [
      { id: "T1055", name: "Process Injection" },
      { id: "T1571", name: "Non-Standard Port" },
    ],
  },
  {
    name: "Backdoor.PuttyPowerfun.Win32",
    alias: "SillyPutty.exe",
    type: "Backdoor",
    behaviour: {
      en: "A trojanised PuTTY that launches a hidden PowerShell \"Powerfun\" shell over SSL.",
      fr: "Un PuTTY trojanisé qui lance un shell PowerShell « Powerfun » caché, chiffré en SSL.",
    },
    iocs: ["hidden PowerShell", "TCP/8443"],
    attack: [
      { id: "T1059.001", name: "PowerShell" },
      { id: "T1573", name: "Encrypted Channel" },
    ],
  },
  {
    name: "Stealer.SikoMode.Nim",
    alias: "Stealer.exe.malz",
    type: "Stealer",
    behaviour: {
      en: "Nim stealer that RC4-encrypts its loot with the key SikoMode, exfiltrates it and deletes itself.",
      fr: "Stealer en Nim qui chiffre son butin en RC4 avec la clé SikoMode, l'exfiltre puis s'autodétruit.",
    },
    iocs: ["cdn.altimiter.local", "RC4 key: SikoMode", "houdini"],
    attack: [
      { id: "T1041", name: "Exfiltration Over C2 Channel" },
      { id: "T1070.004", name: "File Deletion" },
    ],
  },
  {
    name: "Stealer.YouUp.Nim",
    alias: "Malware.Unknown.exe.malz",
    type: "Stealer",
    behaviour: {
      en: "Nim stealer that encrypts and base64-encodes a file before sending it home.",
      fr: "Stealer en Nim qui chiffre puis encode en base64 un fichier avant de l'envoyer.",
    },
    iocs: ["hey.youup.local", "cosmo.jpeg"],
    attack: [
      { id: "T1041", name: "Exfiltration Over C2 Channel" },
      { id: "T1132.001", name: "Standard Encoding" },
    ],
  },
  {
    name: "RAT.MsCoreBind.Nim",
    alias: "RAT.CmdSocket.exe.malz",
    type: "RAT",
    behaviour: {
      en: "Nim bind shell that persists through the Startup folder and dresses up as a Microsoft binary.",
      fr: "Bind shell en Nim, persistant via le dossier Démarrage et déguisé en binaire Microsoft.",
    },
    iocs: ["TCP/5555 (listen)", "Startup folder"],
    attack: [
      { id: "T1547.001", name: "Registry Run Keys / Startup Folder" },
      { id: "T1036.005", name: "Match Legitimate Name or Location" },
    ],
  },
  {
    name: "RAT.Kadusus.Win32",
    alias: "RAT.Unknown2.exe.malz",
    type: "RAT",
    behaviour: {
      en: "Reverse shell over HTTPS; finds its C2 through a DNS A record.",
      fr: "Reverse shell via HTTPS ; trouve son C2 grâce à un enregistrement DNS A.",
    },
    iocs: ["kadusus.local", "TCP/443"],
    attack: [
      { id: "T1071.001", name: "Web Protocols" },
      { id: "T1071.004", name: "DNS" },
    ],
  },
  {
    name: "Dropper.NotelyWitch.Win64",
    alias: "Dropper.Trojan.exe.malz",
    type: "Dropper",
    behaviour: {
      en: "Trojanised \"Notely\" installer: a Startup VBS runs curl, which fetches a DLL disguised as a JPG for regsvr32.",
      fr: "Installeur « Notely » trojanisé : un VBS au démarrage lance curl, qui récupère une DLL déguisée en JPG pour regsvr32.",
    },
    iocs: ["WitchABy.jpg", "regsvr32", "Startup VBS"],
    attack: [
      { id: "T1218.010", name: "Regsvr32" },
      { id: "T1105", name: "Ingress Tool Transfer" },
      { id: "T1547.001", name: "Startup Folder" },
    ],
  },
  {
    name: "Dropper.HelpdeskBros.Win32",
    alias: "Dropper.DownloadFromURL.exe",
    type: "Dropper",
    behaviour: {
      en: "Downloads a fake favicon.ico payload from its C2, runs it, and deletes itself if anything fails.",
      fr: "Télécharge une fausse charge favicon.ico depuis son C2, l'exécute et s'autodétruit en cas d'échec.",
    },
    iocs: ["favicon.ico (payload)"],
    attack: [
      { id: "T1105", name: "Ingress Tool Transfer" },
      { id: "T1070.004", name: "File Deletion" },
    ],
  },
  {
    name: "Stager.PastePlugin.PS1",
    alias: "worker?=7341210743/ai-plugin",
    writeup: "youtube-paste-stealer",
    type: "Stager",
    behaviour: {
      en: "Served only to a PowerShell User-Agent. Adds Defender exclusions, turns SmartScreen off, drops cmmd.exe, then wipes the clipboard and PSReadLine history.",
      fr: "Servi uniquement à un User-Agent PowerShell. Ajoute des exclusions Defender, coupe SmartScreen, dépose cmmd.exe puis efface le presse-papiers et l'historique PSReadLine.",
    },
    iocs: ["soft-storage[.]top", "193.148.56[.]147", "cmmd.exe"],
    attack: [
      { id: "T1204.004", name: "Malicious Copy and Paste" },
      { id: "T1562.001", name: "Impair Defenses" },
      { id: "T1070.003", name: "Clear Command History" },
    ],
  },
  {
    name: "Loader.SterlingSignal.Win64",
    alias: "cmmd.exe",
    writeup: "youtube-paste-stealer",
    type: "Loader",
    behaviour: {
      en: "Garbled Go loader. Decrypts its API table at runtime (hidden-desktop/GDI capture capability), then beacons POST /exports with a spoofed github.com host on TCP 5930/5621, waiting for a stage two. VT 37/67, trojan/downloader.",
      fr: "Loader Go passé à garble. Déchiffre sa table d'API à l'exécution (capacité bureau caché / capture GDI), puis balise POST /exports avec un host github.com usurpé sur TCP 5930/5621, en attente d'une seconde étape. VT 37/67, trojan/downloader.",
    },
    iocs: ["sylpxe[.]click", "netulse[.]sbs", "TCP 5930/5621", "SterlingSignalVentures"],
    attack: [
      { id: "T1027.013", name: "Encrypted/Encoded File" },
      { id: "T1106", name: "Native API" },
      { id: "T1571", name: "Non-Standard Port" },
      { id: "T1071.001", name: "Web Protocols" },
    ],
  },
  {
    name: "Stealer.Mrdor.macOS",
    alias: "p7tp4i95c5x1fs96",
    writeup: "youtube-paste-stealer",
    type: "Stealer",
    behaviour: {
      en: "AMOS-like stealer: fake System Settings password prompt, keychain, browsers, 203 wallet extensions, trojanised Ledger and Trezor apps, LaunchAgent persistence.",
      fr: "Stealer de type AMOS : fausse invite System Settings, trousseau, navigateurs, 203 extensions de portefeuilles, Ledger et Trezor piégés, persistance par LaunchAgent.",
    },
    iocs: ["lewokodwqko[.]icu", "shopguoerve[.]pro", "com.hlpr.agent"],
    attack: [
      { id: "T1056.002", name: "GUI Input Capture" },
      { id: "T1555.001", name: "Keychain" },
      { id: "T1554", name: "Compromise Host Software Binary" },
    ],
  },
];
