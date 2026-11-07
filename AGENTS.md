# CineCut Studio — Instruções do Agente (AGENTS.md)

> Diretrizes compartilhadas e portáveis para agentes de IA (Claude, Codex, Antigravity) atuando no desenvolvimento do CineCut Studio.

---

## 1. Produto e Contexto

- **Visão do Produto**: `PRODUCT.md` (leia antes de propor qualquer funcionalidade ou alteração arquitetural).
- **Decisões de Engenharia & Shaders**: `docs/architecture.md`.
- **Objetivo Central**: Desenvolver uma plataforma de edição de vídeo no navegador que una a agilidade do CapCut, os controles cenográficos do After Effects (curvas Bézier, blend modes, luzes, partículas) e o rigor de corte e áudio do Premiere Pro, operando com facilidade tanto para leigos quanto para profissionais.
- **Stack Canônica**:
  - Framework: Next.js 15 (App Router) + React 19 + TypeScript (strict mode)
  - Estilização: Tailwind CSS + Lucide Icons + Framer Motion
  - Core de Vídeo: WebCodecs API (`VideoDecoder`, `VideoEncoder`) + `mp4box.js` + `mp4-muxer` + FFmpeg.wasm (fallback)
  - Gráficos & Efeitos: WebGL2 (GLSL fragment shaders) + OffscreenCanvas
  - Áudio: Web Audio API (`AudioContext`, gain nodes, equalizers)
  - Estado: Zustand (com Immer e middleware de Command Pattern / Undo-Redo)
  - Testes: Vitest

---

## 2. Comandos Canônicos

Execute sempre os comandos reais do projeto. Nunca invente flags ou scripts inexistentes:

- **Instalar Dependências**: `npm install`
- **Ambiente de Desenvolvimento**: `npm run dev`
- **Lint & Verificação de Estilo**: `npm run lint`
- **Checagem Estrita de Tipos**: `npm run typecheck`
- **Testes Unitários**: `npm run test`
- **Build de Produção**: `npm run build`
- **Verificação Geral da Fundação**: `npm run check` (combina lint, typecheck, test e build)

---

## 3. Acordos de Trabalho & Filosofia de Código

1. **Leia Antes de Escrever**: Inspecione os arquivos relevantes e a documentação antes de realizar qualquer alteração. Não assuma contratos sem ver o código real.
2. **Mudança Mínima e Suficiente**: Resolva a solicitação com a menor alteração completa e segura. Reutilize padrões, componentes de UI e utilitários existentes.
3. **Preserve a Integridade de Mídia**: Em código de WebCodecs e WebGL, o vazamento de memória é fatal. Sempre invoque `.close()` em instâncias de `VideoFrame` e libere buffers de texturas WebGL.
4. **Sem Alucinações de Progresso**: Nunca simule um pipeline de decodificação ou renderização como se estivesse funcionando se for um mock temporário. Mantenha os mocks documentados e explícitos.
5. **Ergonomia Visual Dark**: O editor deve seguir a paleta cinemática escura (Dark Charcoal / Slate 900 / Zinc 950 com acentos Âmbar/Ciano para playhead e seleções).
6. **Controle de Tamanho de Arquivo**: Nenhum componente ou arquivo deve ultrapassar 350 linhas de código. Modularize em subcomponentes e hooks puros.

---

## 4. Continuidade de Execução

- **Trabalho em Fases**: Execute o roadmap em ondas lógicas e verificáveis (Fase 1: Fundação & UI Base -> Fase 2: Timeline Engine -> Fase 3: Renderizador WebGL & Efeitos Cenográficos -> Fase 4: Exportação & Otimização).
- **Resolução de Bloqueios**: Se uma dependência de sistema ou browser API específica não estiver disponível no terminal, teste com mocks adequados no Vitest e documente a verificação necessária no browser.
- **Handoff Claro**: Ao final de cada ciclo, atualize o status de progresso, os arquivos alterados e qual é o próximo passo imediato.

---

## 5. Convenções de Código e Estrutura de Pastas

```
src/
├── app/                  # Rotas do Next.js (App Router)
│   ├── page.tsx          # Landing / Dashboard de Projetos
│   ├── editor/           # Editor Workspace principal
│   │   └── page.tsx      # Rota do editor com "use client"
│   └── layout.tsx        # Layout raiz
├── components/           # Componentes modulares de UI
│   ├── editor/
│   │   ├── TopNavigation.tsx      # Ações de projeto, export, aspect ratio
│   │   ├── MediaLibrary.tsx       # Importação e listagem de mídias
│   │   ├── PreviewPlayer.tsx      # Canvas do player com overlay interativo
│   │   ├── Timeline/              # Componentes da linha do tempo
│   │   │   ├── TimelineContainer.tsx
│   │   │   ├── TimelineRuler.tsx  # Régua de tempo e agulha (playhead)
│   │   │   ├── TrackHeader.tsx    # Controles de mute/lock da faixa
│   │   │   ├── TrackRow.tsx       # Linha de clipes
│   │   │   └── ClipItem.tsx       # Bloco de clipe arrastável com alças de trim
│   │   └── Inspector/             # Painel de propriedades à direita
│   │       ├── TransformPanel.tsx # Posição, escala, rotação, opacidade
│   │       ├── KeyframeEditor.tsx # Curvas de interpolação Bézier
│   │       ├── BlendModes.tsx     # Seleção de modos de mesclagem
│   │       ├── ColorGrading.tsx   # Sliders de exposição, contraste, LUTs
│   │       └── CinematicEffects.tsx # Grain, aberração cromática, vignette
├── core/                 # Motores de renderização desacoplados da UI
│   ├── engine/
│   │   ├── VideoCompositor.ts     # Orquestrador de camadas
│   │   ├── WebGLRenderer.ts       # Setup de shaders e render loop
│   │   ├── AudioMixer.ts          # Web Audio API mixer
│   │   └── ExportPipeline.ts      # Pipeline de encode com mp4-muxer
│   ├── shaders/                   # Fragment shaders GLSL
│   │   ├── blendModes.glsl.ts
│   │   ├── colorGrading.glsl.ts
│   │   └── cinematicAtmosphere.glsl.ts
│   └── workers/                   # Web Workers para decodificação assíncrona
├── store/                # Gerenciamento de estado (Zustand)
│   ├── useProjectStore.ts         # Estado do projeto (tracks, clips, keyframes)
│   ├── usePlayheadStore.ts        # Posição da agulha, playback e fps
│   └── historyMiddleware.ts       # Command Pattern para Undo/Redo
├── types/                # Definições estritas de TypeScript
│   └── project.ts                 # Interfaces do modelo CineProject
└── lib/                  # Utilitários compartilhados (cn, formatters, maths)
```
