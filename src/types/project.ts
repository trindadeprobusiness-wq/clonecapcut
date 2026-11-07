/**
 * Modelo de Dados Principal do CineCut Studio
 * Padrão compatível com serialização JSON e Command Pattern (Undo/Redo)
 */

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5" | "21:9";

export interface ProjectSettings {
  width: number;
  height: number;
  fps: 24 | 30 | 60;
  duration: number; // Duração total em segundos
  aspectRatio: AspectRatio;
}

export type TrackType = "video" | "audio" | "text" | "overlay";

export type BlendMode =
  | "normal"
  | "screen"
  | "multiply"
  | "overlay"
  | "add"
  | "color-dodge"
  | "soft-light";

export type EasingType =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "spring"
  | "bounce";

export interface Keyframe<T = number> {
  id: string;
  time: number; // Tempo relativo ao clipe em segundos
  value: T;
  easing: EasingType;
}

export interface TransformProperties {
  x: number; // Offset horizontal em pixels ou porcentagem
  y: number; // Offset vertical
  scale: number; // 1.0 = 100%
  rotation: number; // Graus (0 - 360)
  opacity: number; // 0.0 a 1.0
  keyframes?: {
    x?: Keyframe[];
    y?: Keyframe[];
    scale?: Keyframe[];
    rotation?: Keyframe[];
    opacity?: Keyframe[];
  };
}

export interface ColorGradeProperties {
  exposure: number; // -100 a +100
  contrast: number; // -100 a +100
  temperature: number; // -100 (Frio/Azul) a +100 (Quente/Âmbar)
  tint: number; // -100 (Verde) a +100 (Magenta)
  saturation: number; // 0 a 200 (100 = original)
  lutUrl?: string;
}

export interface CinematicProperties {
  filmGrain: number; // 0 a 100
  chromaticAberration: number; // 0 a 100
  vignette: number; // 0 a 100
  glowIntensity: number; // 0 a 100
}

export interface Clip {
  id: string;
  name: string;
  trackId: string;
  type: "video" | "audio" | "image" | "text";
  mediaUrl: string;
  startOnTimeline: number; // Segundo de início na timeline
  duration: number; // Duração na timeline
  trimStart: number; // Ponto de corte inicial da mídia
  trimEnd: number; // Ponto de corte final da mídia
  
  transform: TransformProperties;
  blendMode: BlendMode;
  colorGrade: ColorGradeProperties;
  cinematic: CinematicProperties;
  
  // Customização para texto/títulos
  textProperties?: {
    content: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    tracking: number; // Letter-spacing
    isTitle: boolean;
  };

  volume: number; // 0.0 a 2.0 (1.0 = 100%)
  isMuted: boolean;
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  isMuted: boolean;
  isLocked: boolean;
  order: number;
  clips: Clip[];
}

export interface CineProject {
  id: string;
  title: string;
  version: "1.0.0";
  createdAt: string;
  updatedAt: string;
  settings: ProjectSettings;
  tracks: Track[];
}

