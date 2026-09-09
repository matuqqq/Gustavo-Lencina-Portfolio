# Gustavo Encina Portfolio — sistema visual

## Dirección

- Producto: portfolio / marca personal creativa orientada a oportunidades laborales.
- Patrón: storytelling-driven + portfolio grid + trust & authority.
- Estilo: editorial oscuro, motion-driven y kinetic typography con guiños de brutalismo suave.
- Personalidad: curioso, humano, científico, sensible, territorial; nunca corporativo ni genérico.
- CTA primario: `Hablemos` / `Preparar mensaje`.
- CTA secundario: `Entrar al archivo`.

## Tokens

```css
--bg: #0B0B0D;
--bg-soft: #111116;
--surface: #17171D;
--text: #F2EFE9;
--text-muted: #A7A29B;
--accent: #FF6A1A;
--accent-light: #FFB26F;
--paper: #F1EDE5;
--line: rgba(242, 239, 233, .18);
--shell: min(1320px, calc(100% - 64px));
```

## Tipografía

- Display: Newsreader, 400–700, serif editorial; usar en títulos, citas y nombres de obras.
- UI/body: Space Grotesk, 400–700; usar en navegación, labels, metadata y párrafos.
- Display con `clamp()`, tracking negativo y line-height corto; body mínimo 16px en mobile y line-height 1.5–1.7.

## Layout

- Mobile-first con breakpoints 760 / 1080.
- Grid principal de 12 columnas en desktop; obras alternan 7/5 y 5/7 para evitar una galería monótona.
- Área máxima 1320px, gutters 18px mobile / 32px desktop.
- Sin scroll horizontal en mobile salvo carruseles explícitos con affordance visible.
- Touch targets mínimos 44px.

## Motion

- Scroll reveal con IntersectionObserver: opacity + translateY, 700ms.
- Microinteracciones: 180–240ms; entradas complejas ≤400ms.
- Hover de obra: scale de imagen, overlay y metadatos; nunca animar layout.
- Modal con continuidad espacial, navegación anterior/siguiente y cierre con Escape.
- Marquee de especialidades pausado visualmente con `prefers-reduced-motion`.
- Siempre respetar `prefers-reduced-motion: reduce`.

## Accesibilidad y performance

- Contraste alto sobre fondo oscuro y estado focus visible.
- `alt` descriptivo en toda imagen significativa.
- Navegación con enlaces semánticos, skip link y menú móvil con `aria-expanded`.
- Imágenes extraídas y convertidas a WebP; dimensiones declaradas; `loading="lazy"` debajo del hero.
- Formulario con labels visibles, validación nativa y feedback `role="status"`.
