# CineCut Studio

Editor e compositor de vídeo no navegador. Junta a facilidade do CapCut, os controles de cena do After Effects (keyframes com curvas, blend modes, efeitos de luz) e a precisão de corte do Premiere Pro. Usa nome e identidade visual próprios; o nome do repositório (`clonecapcut`) é só interno.

> Este documento foi reconstruído a partir de `AGENTS.md`, `CLAUDE.md`, `docs/architecture.md` e `docs/claude-execution-prompt.md` em 2026-11-07. A versão anterior do `PRODUCT.md` foi sobrescrita durante o bootstrap e não estava no git. Revise se alguma informação da versão original ficou de fora.

## Problema e objetivo

Quem cria vídeos hoje escolhe entre ferramentas fáceis e limitadas (editores de celular) ou ferramentas poderosas e difíceis (After Effects, Premiere), que exigem instalação e máquina forte. O objetivo é um editor no navegador, sem instalar nada, que seja simples para iniciantes e tenha controles de composição e cor para profissionais, com exportação MP4 feita no próprio computador do usuário.

## Público e papéis

- **Criador iniciante**: corta, junta, coloca texto e exporta rápido.
- **Editor avançado**: usa keyframes, blend modes, correção de cor e efeitos de película.
- Um único papel técnico (o usuário local) no MVP; não há login nem colaboração.
- Uso em desktop/notebook com navegador que suporte WebCodecs e WebGL2.

## Fluxos da primeira versão

1. **Criar projeto**: escolher proporção (16:9, 9:16, 1:1) e FPS (24, 30 ou 60).
2. **Importar mídia**: arrastar vídeos e áudios para a biblioteca, com miniaturas, e inserir na linha do tempo.
3. **Editar na linha do tempo**: várias faixas (vídeo, áudio, texto, sobreposição), mover clipes, trim nas bordas, dividir na agulha (lâmina), zoom, mute e bloqueio de faixa.
4. **Ajustar o clipe no inspetor**: posição, escala, rotação e opacidade; blend mode; cor (exposição, contraste, temperatura, saturação); efeitos (grão de filme, vinheta, aberração cromática); presets de animação por keyframe.
5. **Pré-visualizar**: player com transporte (play/pause, ±1s) e timecode `00:00:00:00`, renderizando a composição em tempo real.
6. **Exportar**: gerar o MP4 em resolução total no navegador, com barra de progresso, e baixar o arquivo.

## MVP

Na ordem das fases definidas em `docs/claude-execution-prompt.md`:

1. **Fundação**: tipos do modelo `CineProject` e stores de projeto e agulha (adicionar, mover, dividir clipe; play, pause, seek).
2. **Interface e linha do tempo**: rota `/editor` em tema escuro com barra superior, biblioteca de mídia, player, linha do tempo multifaixa e inspetor.
3. **Motor de renderização**: compositor WebGL2 com blend modes, correção de cor, efeitos atmosféricos e interpolação de keyframes a 60 FPS.
4. **Exportação e polimento**: exportação MP4 local (WebCodecs + `mp4-muxer`), desfazer/refazer ilimitado e atalhos (Espaço, J/K/L, C, Delete, Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z ou Ctrl+Y).

## Fora do escopo

- Login, contas, colaboração e compartilhamento de projetos.
- Renderização ou armazenamento de vídeo na nuvem.
- Recursos de IA (legendas automáticas, remoção de fundo).
- Apps nativos e edição completa no celular.
- Planos pagos e cobrança.

## Requisitos

- Interface em português do Brasil.
- Tema escuro cinematográfico (Zinc 950 / Slate 900, com destaques âmbar/ciano para agulha e seleção).
- Projeto serializável em JSON puro (modelo em `docs/architecture.md`).
- Sem vazamento de memória: todo `VideoFrame` é fechado com `.close()` no mesmo ciclo, e texturas WebGL são liberadas.
- Pré-visualização pode rodar em meia resolução; exportação sempre em resolução total.
- Acessível por teclado, com foco visível e contraste adequado; respeitar `prefers-reduced-motion`.
- Arquivos com no máximo 350 linhas.

## Restrições e decisões técnicas

- **Instalado no bootstrap (2026-11-07)**: Next.js 16.4.5 (App Router, Turbopack), React 19.3.0, TypeScript 5.9.3 estrito, Tailwind 4, ESLint 9, npm, Node.js 22, `src/`, alias `@/*`.
- **Núcleo de servidor**: Drizzle ORM + PostgreSQL (`pg`), Zod, Pino, `server-only`, Vitest, `clsx` + `tailwind-merge`.
- **Motor de vídeo (planejado)**: WebCodecs, `mp4box.js`, `mp4-muxer`, FFmpeg.wasm como alternativa, WebGL2 + OffscreenCanvas, Web Audio API, Web Workers.
- **Estado e UI (planejado)**: Zustand + Immer com histórico por comandos, Lucide Icons, Framer Motion.

## Suposições e decisões pendentes

- **Versão do Next.js**: `AGENTS.md`, `CLAUDE.md` e os docs falam em Next.js 15; o bootstrap instalou a versão estável atual, 16.4.5, como o guia manda. Impacto: atualizar a menção nesses documentos ou fixar a versão 15. Recomendação: manter 16.4.5 e atualizar os documentos.
- **Persistência**: a arquitetura é local-first (IndexedDB/OPFS para mídia e JSON do projeto), mas o bootstrap instalou o núcleo Drizzle + PostgreSQL, que é o padrão do guia. Hoje o banco não é usado e não exige credenciais. Impacto: decidir se haverá dados no servidor (por exemplo, galeria de projetos) ou se o banco deve ser removido. Próximo passo: decidir antes da Fase 2; sem uso de servidor, remover Drizzle/`pg` e registrar o motivo aqui.
- **Navegadores suportados**: WebCodecs não está disponível em todos os navegadores. Suposição: Chrome/Edge atuais primeiro; definir a mensagem para navegadores sem suporte.
- **Limites de mídia** (tamanho, duração, resolução máxima): pendente; afeta memória do navegador.

## Critérios de aceite

**Produto (MVP):**

- O usuário cria um projeto 9:16 a 30 FPS, importa dois vídeos e uma música, corta e divide clipes, adiciona um texto, aplica um blend mode e uma correção de cor, e exporta um MP4 que reproduz em player comum igual à pré-visualização.
- A pré-visualização roda sem travar durante a reprodução, e o uso de memória não cresce continuamente.
- Desfazer e refazer funcionam em todas as operações da linha do tempo e do inspetor.
- Todos os atalhos listados funcionam.

**Setup técnico (bootstrap):**

- `npm run check` passa (lint, tipos, testes e build) sem credenciais reais.
- `npm run dev` mostra a página inicial.

## Próxima entrega

Fase 1: criar `src/types/project.ts` com o modelo `CineProject` de `docs/architecture.md` e as stores `useProjectStore` e `usePlayheadStore`, com testes Vitest para adicionar, mover e dividir clipes.

## Manutenção

Atualize este documento quando o objetivo, o escopo, as restrições ou os critérios de aceite mudarem. Decisões técnicas detalhadas e evidências ficam em `docs/architecture.md` e `docs/setup.md`.
