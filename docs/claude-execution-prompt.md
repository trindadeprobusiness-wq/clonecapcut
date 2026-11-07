# Prompt Mestre de Execução para o Claude
## Como executar a construção do CineCut Studio do início ao fim

> **Instruções para o Usuário**: Copie todo o texto abaixo e envie diretamente para o Claude (seja no Claude Code no terminal ou na interface do Claude). Ele iniciará a execução da Fase 1 imediatamente de forma autônoma e estruturada.

---

```text
Olá, Claude! Você é o Arquiteto e Engenheiro Líder responsável por construir o CineCut Studio neste repositório.

Seu objetivo é criar uma plataforma de edição e composição de vídeo inovadora no navegador que seja superior ao CapCut: combinando a extrema facilidade e agilidade do CapCut com o poder cenográfico do After Effects (curvas Bézier, blend modes de iluminação, partículas, flares, keyframing suave) e a precisão do Premiere Pro (timeline multi-track com magnetismo, corte cirúrgico e gradação de cores Lumetri).

Antes de codificar, leia e respeite os documentos mestres já presentes na raiz:
1. PRODUCT.md (visão completa, personas, diferenciais cenográficos e MVP)
2. docs/architecture.md (arquitetura de WebCodecs, WebGL2, Zustand e Workers)
3. AGENTS.md e CLAUDE.md (regras de conduta, comandos e estrutura)

Execute o projeto seguindo rigorosamente as 4 fases abaixo, testando cada etapa antes de avançar:

================================================================================
FASE 1: FUNDAÇÃO DO PROJETO & MODELO DE DADOS
================================================================================
1. Configure a aplicação com Next.js 15 (App Router), TypeScript estrito, Tailwind CSS e Lucide Icons (se ainda não inicializado na raiz, inicialize ou monte a estrutura limpa).
2. Instale as dependências essenciais:
   - zustand e immer (gerenciamento de estado e imutabilidade)
   - clsx e tailwind-merge (utilitários de classe)
   - framer-motion (animações fluidas da UI)
   - mp4-muxer e mp4box (demuxing e exportação local)
3. Crie os tipos em src/types/project.ts conforme o modelo CineProject em docs/architecture.md (CineProject, Track, Clip, Transform, Effects, KeyframeTrack, etc.).
4. Crie a store inicial do Zustand (src/store/useProjectStore.ts e src/store/usePlayheadStore.ts) com suporte a:
   - Adicionar clipe na timeline
   - Mover clipe (startOnTimeline)
   - Cortar clipe (split na posição da agulha)
   - Alterar propriedades de transformação e efeitos cenográficos
   - Play, Pause e Seek da agulha (currentTime).
5. Valide com `npm run typecheck` e garanta que não há erros de compilação.

================================================================================
FASE 2: INTERFACE PROFISSIONAL & TIMELINE MULTI-TRACK
================================================================================
1. Crie a rota do editor em src/app/editor/page.tsx com layout Dark Cinematic (estilo DaVinci Resolve / CapCut Pro, tons Zinc 950 e Slate 900).
2. Desenvolva os componentes de UI em src/components/editor/:
   - TopNavigation: Título do projeto, seletor de proporção (16:9, 9:16, 1:1), botão de Undo/Redo e botão destacado de "Exportar Vídeo".
   - MediaLibrary (lado esquerdo): Área de drag-and-drop de arquivos de vídeo/áudio do usuário com geração de thumbnails e botão de "Inserir na Timeline".
   - PreviewPlayer (centro superior): Monitor de vídeo com controles de transporte (Play/Pause, Voltar 1s, Avançar 1s, tempo atual / tempo total em formato timecode 00:00:00:00).
   - TimelineContainer (centro inferior):
     - Régua de tempo interativa com marcações de segundos e agulha (playhead) arrastável.
     - Linhas de faixas (Tracks) com botões de Mute e Lock.
     - Blocos de clipes visuais com título, cor temática por tipo (azul para vídeo, verde para áudio, roxo para texto) e alças de trim nas extremidades esquerda/direita.
     - Suporte a zoom da timeline (+ / -) e ferramenta de lâmina (Split no corte).
   - Inspector (lado direito):
     - Aba "Transformação": Posição X/Y, Escala, Rotação e Opacidade com sliders em tempo real.
     - Aba "Cenografia & Blend": Seletor visual de Blend Modes (Normal, Screen, Multiply, Overlay, Add) e efeitos atmosféricos (Film Grain, Vignette, Aberração Cromática).
     - Aba "Cor (Lumetri)": Sliders de Exposição, Contraste, Temperatura e Saturação.
     - Aba "Animação / Keyframes": Presets de interpolação curva (Linear, Ease In/Out, Bounce cinematográfico).

================================================================================
FASE 3: MOTOR DE VÍDEO, SHADERS WEBGL2 & COMPOSIÇÃO
================================================================================
1. Em src/core/engine/WebGLRenderer.ts, implemente o renderizador em WebGL2 que renderiza o frame composto no canvas de preview:
   - Crie os shaders GLSL para:
     a) Blend Modes (Screen, Multiply, Overlay, Add) para combinar camadas de vídeo/overlays.
     b) Filtro de Gradação de Cor (Color Grading) aplicando contraste, temperatura e saturação.
     c) Efeito de Película Cinematográfica (Film Grain dinâmico gerado em GPU).
     d) Vignette suave e Aberração Cromática nas bordas da lente.
2. Integre o motor de playback:
   - Sincronize a agulha de tempo com o `requestAnimationFrame` para playback fluido a 60 FPS.
   - Aplique as transformações espaciais (X, Y, Escala, Rotação) no canvas para cada clipe ativo no tempo corrente.
   - Aplique interpolação entre keyframes de forma que se um clipe tiver keyframes de escala/posição, a animação ocorra de forma cinematográfica suave.
3. Garanta a liberação imediata de recursos de textura e frames para prevenir vazamentos de memória.

================================================================================
FASE 4: EXPORTAÇÃO LOCAL EM MP4 & POLIMENTO FINAL
================================================================================
1. Implemente o pipeline de exportação em src/core/engine/ExportPipeline.ts:
   - Utilize `mp4-muxer` em conjunto com a API nativa do navegador para compor o vídeo quadro a quadro em resolução total.
   - Exiba uma barra de progresso visual de renderização (0% a 100%) para o usuário.
   - Faça o download automático do arquivo `.mp4` diretamente para o disco do usuário ao concluir.
2. Adicione atalhos de teclado de padrão profissional:
   - `Espaço`: Play / Pause
   - `J / K / L`: Rebobinar, Pausar, Acelerar
   - `C`: Lâmina (Split no clipe selecionado na posição da agulha)
   - `Delete / Backspace`: Deletar clipe selecionado
   - `Ctrl+Z / Cmd+Z`: Desfazer
   - `Ctrl+Y / Cmd+Shift+Z`: Refazer
3. Execute `npm run check` para garantir 0 erros de lint, 0 erros de tipo e build de produção bem-sucedido.

Comece agora pela Fase 1, relatando o que realizou e avançando com maestria técnica!
```

