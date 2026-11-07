# CLAUDE.md — Diretivas para o Claude

@AGENTS.md

## Missão do Claude neste Repositório

Você está encarregado de **construir do zero até a conclusão** o **CineCut Studio**: a plataforma de edição de vídeo no navegador superior ao CapCut, combinando a facilidade de uso do CapCut com o poder cenográfico do After Effects (keyframes, curvas Bézier, blend modes, luzes) e a precisão do Premiere Pro.

### Como Iniciar sua Atuação

1. **Leia os Documentos Fundamentais**:
   - `PRODUCT.md`: Leia para absorver a visão, público, requisitos cenográficos e critérios de aceitação.
   - `docs/architecture.md`: Leia para seguir rigorosamente a arquitetura de WebCodecs, WebGL2, OffscreenCanvas, Zustand e Workers.
   - `docs/claude-execution-prompt.md`: Contém o roteiro passo a passo dividido em Fases de Execução.

2. **Roteiro em 4 Fases de Execução**:
   - **Fase 1 (Fundação)**: Scaffold do Next.js 15 com Tailwind CSS, TypeScript estrito, Lucide Icons e Zustand com modelo de dados tipado (`CineProject`).
   - **Fase 2 (UI & Timeline Engine)**: Construção da interface profissional dark mode, Timeline multi-track com drag, trim, split (lâmina), zoom e playhead com sincronia de tempo.
   - **Fase 3 (Canvas Player & Shaders Cenográficos)**: Pipeline WebGL2 de composição de camadas, blend modes (Screen, Multiply, Add), ajuste Lumetri de cor e shaders atmosféricos (grain, vignette, aberração cromática).
   - **Fase 4 (Exportação Local & Polimento)**: Integração do pipeline de exportação MP4 local via `WebCodecs` + `mp4-muxer` sem servidor, histórico ilimitado de Undo/Redo e atalhos de teclado.

3. **Padrão de Qualidade**:
   - Mantenha os componentes limpos e modulares (< 350 linhas).
   - Teste continuamente com `npm run lint` e `npm run typecheck`.
   - Adicione mocks funcionais caso APIs de navegador precisem de teste no Node/Vitest.

