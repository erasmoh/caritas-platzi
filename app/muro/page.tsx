import Image from "next/image";
import {
  getSupabaseBrowserConfig,
  listWallImages,
  shuffleWallImages,
  SupabaseWallConfigError,
  type SupabaseBrowserConfig,
  type WallImageRecord,
} from "../lib/wall";
import WallRealtime from "./wall-realtime";

export const dynamic = "force-dynamic";

type WallPageState =
  | {
      configured: true;
      images: WallImageRecord[];
      supabaseConfig: SupabaseBrowserConfig | null;
    }
  | {
      configured: false;
      images: [];
      supabaseConfig: null;
    };

async function getWallPageState(): Promise<WallPageState> {
  try {
    return {
      configured: true,
      images: shuffleWallImages(await listWallImages()),
      supabaseConfig: getSupabaseBrowserConfig(),
    };
  } catch (error) {
    if (error instanceof SupabaseWallConfigError) {
      return {
        configured: false,
        images: [],
        supabaseConfig: null,
      };
    }

    throw error;
  }
}

export default async function MuroPage() {
  const state = await getWallPageState();

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#202124] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(66,133,244,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(234,67,53,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(251,188,5,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(52,168,83,0.16),transparent_30%)]" />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-start justify-between gap-6 bg-gradient-to-b from-[#202124]/92 via-[#202124]/55 to-transparent p-5 pb-20 sm:p-8 sm:pb-24">
        <h1
          className="max-w-[calc(100%-8rem)] text-4xl font-black uppercase leading-[0.98] tracking-[0.08em] text-[#FBBC05] [font-variant-ligatures:none] [text-shadow:4px_4px_0_#202124] sm:max-w-[calc(100%-11rem)] sm:text-6xl lg:text-7xl"
          style={{
            fontFamily:
              "'Courier New', Courier, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
          }}
        >
          MURO BUILD WITH AI MEDELLIN
        </h1>
        <div className="shrink-0 bg-white p-2 shadow-[0_18px_55px_rgba(0,0,0,0.55)] sm:p-3">
          <Image
            src="/qr-platzi.png"
            alt="QR para generar tu imagen"
            width={144}
            height={144}
            priority
            className="h-24 w-24 object-contain sm:h-36 sm:w-36"
          />
        </div>
      </header>

      <WallRealtime
        configured={state.configured}
        initialImages={state.images}
        supabaseConfig={state.supabaseConfig}
      />
      <footer className="pointer-events-auto absolute inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#202124]/75 px-5 py-4 text-center font-mono text-xs leading-6 text-zinc-400 backdrop-blur-sm sm:text-sm">
        Creado por{" "}
        <a
          href="https://erasmoh.dev"
          target="_blank"
          rel="noreferrer"
          className="font-black text-[#4285F4] underline decoration-[#4285F4]/40 underline-offset-4 transition hover:text-[#34A853]"
        >
          @ErasmoHernandez
        </a>
        , con amor para BUILD WITH AI Medellin ·{" "}
        <a
          href="https://erasmoh.dev"
          target="_blank"
          rel="noreferrer"
          className="font-black text-white underline decoration-white/30 underline-offset-4 transition hover:text-[#FBBC05]"
        >
          erasmoh.dev
        </a>
      </footer>
    </main>
  );
}
