> Guía original de la plantilla. Las rutas a `scripts/new-project.sh` y `../../scripts/lighthouse.sh` son del repositorio interno de Revolution505.

# consultorio-astro — Sitio de 1 página para consultorios (Astro 5 + Tailwind 4)

Para dentistas, médicos, psicólogos, nutriólogos, fisioterapeutas… Demo **ficticia**: clínica dental
"Brisa Dental Querétaro" (la clínica, la especialista y los testimonios no existen).

## Qué incluye
- **Hero** con CTA WhatsApp + cita en línea + teléfono, horario y cédula profesional visibles.
- **Tratamientos** (8 tarjetas) — cada una con enlace "Agendar …" a WhatsApp con el tratamiento en el mensaje.
- **Perfil del especialista** con foto (`<Image>` de `astro:assets`, WebP responsivo, lazy) y
  **cédula profesional visible** (`cedulaProfesional`, obligatoria en publicidad de salud en México)
  + cédula de especialidad opcional. También se repite en el hero y en el footer ("Responsable sanitario").
- **Primera visita / qué esperar** (4 pasos + "qué traer").
- **Seguros y formas de pago** (métodos, reembolso de aseguradoras, CFDI).
- **Testimonios** de ejemplo, marcados en `site.ts` y con aviso visible mientras `testimonialsAreExamples: true`.
- **FAQ** (schema FAQPage), **ubicación + horario** (mapa click-to-load, nota de urgencias, estacionamiento).
- **Formulario de cita**: nombre, teléfono, tratamiento, horario preferido, correo opcional, primera visita sí/no,
  motivo opcional y **aceptación del aviso de privacidad** (obligatoria también en el PHP). Botón
  "Mejor por WhatsApp" que arma el mensaje con el tratamiento y horario elegidos.
- **Aviso de privacidad** (`/aviso-de-privacidad/`) como plantilla LFPDPPP con `TODO-CLIENTE`.
- `schemaType` configurable (`Dentist`, `Physician`, `Psychologist`, `MedicalClinic`…) + `employee` (Person)
  + `medicalSpecialty` opcional; WebSite y FAQPage.
- Igual que landing-astro: SEO/OG/canonical en `Base.astro`, GA4 (`generate_lead`, `whatsapp_click`,
  `phone_click`, `email_click`), `public/api/lead.php` (honeypot + tiempo mínimo + rate limit + `LEAD_DRY_RUN`),
  404 real, sitemap, robots, `scripts/php-router.php`.
- Identidad: verde azulado clínico + arena, tipografía Figtree, botones redondeados. Contraste AA.

Medido (26-oct-2026, mobile, Lighthouse 12, build servido con PHP local):
**Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100**.
Playwright: **24/24** (12 pruebas × desktop 1280 + mobile 360). Capturas en `shots/`.

## Convertir en sitio de cliente en < 1 día
1. `bash scripts/new-project.sh consultorio-astro <slug>` (desde la raíz de r505-studio).
2. Pide al cliente (checklist): nombre comercial, **cédula profesional** (y de especialidad) del responsable,
   universidad, foto vertical, lista de tratamientos (¿publica precios/duración?), horario, dirección,
   WhatsApp, aseguradoras con convenio, formas de pago, responsable del aviso de privacidad,
   testimonios **reales con autorización por escrito** (o ninguno).
3. Edita **solo** `src/config/site.ts` — busca `TODO-CLIENTE`:
   - `schemaType` según giro (`Dentist`, `Physician` + `medicalSpecialty`, `Psychologist`…).
   - `specialist.*` (nombre, cédulas, bio, credenciales). Verifica la cédula en el Registro Nacional de
     Profesionistas (SEP) antes de publicar.
   - `treatments` (íconos: `tooth | sparkle | shield | smile | clock | heart | calendar | card | stethoscope | file | baby | brace`).
   - `testimonials` + `testimonialsAreExamples: false` solo con testimonios reales; si no hay, vacía el arreglo
     y quita `<Testimonials />` de `src/pages/index.astro`.
   - `payments`, `faq`, `form.timeOptions`, `privacy`, `whatsappTemplate`.
4. Foto: reemplaza `src/assets/especialista.png` por la real (4:5, ≥ 800 px de ancho); Astro genera WebP.
   (`npm run images` regenera el placeholder.)
5. Colores en `src/styles/global.css` (`--color-brand-*`, `--color-sand-*`) y `themeColor` en site.ts;
   favicon en `public/favicon.svg`. Verifica contraste AA.
6. `npm run og` → `public/og.png`. `.env.local`: `PUBLIC_GA4_ID` (opcional Ads).
7. `npm run check && npm run build && npm test` y Lighthouse (abajo). Deploy según HANDOFF.

**Ojo legal (decide el cliente, no es asesoría):** en México la publicidad de servicios de salud está regulada
(Ley General de Salud / reglamento de publicidad, COFEPRIS): mostrar cédula, no prometer resultados, cuidado con
testimonios y fotos de "antes/después". El aviso de privacidad y el manejo de datos de salud (datos sensibles,
LFPDPPP) los valida el cliente o su asesor. El formulario pide no enviar datos clínicos detallados.

## Comandos
| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo en http://localhost:4321 (el formulario PHP no corre aquí) |
| `npm run check` | TypeScript estricto + diagnósticos Astro |
| `npm run build` | Build estático a `dist/` |
| `npm run preview:php` | Sirve `dist/` con PHP como Hostinger (formulario + 404 real) en :8791 |
| `npm test` | Playwright smoke (desktop 1280 + mobile 360) + capturas en `shots/` |
| `npm run og` / `npm run images` | Regenera `public/og.png` / la foto placeholder |
| `bash ../../scripts/lighthouse.sh http://127.0.0.1:8791/` | Lighthouse mobile → `reports/` |

Para probar el formulario sin enviar correo: `LEAD_DRY_RUN=1 npm run preview:php`.

## Eventos GA4
| Evento | Cuándo | Parámetros |
|---|---|---|
| `generate_lead` | Solicitud de cita enviada con éxito | `service` (tratamiento), `source` (`cita_form`) |
| `whatsapp_click` | Click en cualquier `https://wa.me/…` | `location` (sección: hero, treatments, form…) |
| `phone_click` | Click en `tel:` | `location` |
| `email_click` | Click en `mailto:` | `location` |

**Verificar:** GA4 → Admin → DebugView con la extensión "Google Analytics Debugger"; haz cada acción.
Marca `generate_lead` (y opcional `whatsapp_click`) como **evento clave**.

---

# HANDOFF (copiar a `clients/<slug>/HANDOFF.md` y completar)

## Cómo editar contenido
Todo el texto está en `src/config/site.ts`; la foto en `src/assets/`. Cambiar → `npm run build` → subir `dist/`.

## Credenciales que crea el cliente (no se guardan aquí)
- Acceso al hosting/panel (Hostinger hPanel) y al dominio.
- Buzón `no-reply@<dominio>` para enviar las solicitudes de cita (mismo dominio → SPF/DKIM correctos).
- Propiedad GA4 (el cliente es dueño; nos da acceso de Editor).

## Deploy (Hostinger)
1. `npm run build`.
2. Subir el **contenido** de `dist/` a `public_html/` (incluye `.htaccess` y `api/lead.php`).
3. Copiar `lead-config.example.php` → `lead-config.php`, llenar `to`/`from` y subirlo al directorio
   **padre** de `public_html/` (no accesible por web).
4. Probar: enviar una solicitud real, abrir `/no-existe` (404), `/aviso-de-privacidad/`, `/sitemap-index.xml`, `/robots.txt`.
5. Activar SSL y descomentar el bloque "Forzar HTTPS" en `.htaccess`.

## Datos personales
Las solicitudes llegan por correo al buzón del consultorio; no se guardan en el servidor (solo un contador
anónimo de rate limit en `/tmp`). El consultorio es responsable de esos datos según su aviso de privacidad.

## Backups
Código en git (repo del proyecto). El sitio es estático: el respaldo es el propio `dist/` + repo.

## Mantenimiento mensual R505 (upsell)
Hosting administrado + SSL + monitoreo de disponibilidad + cambios de contenido menores (tratamientos,
horarios, promociones) + reporte mensual de GA4 (solicitudes de cita, clics a WhatsApp).
Precio: ver `docs/pricing.md` (lo define Christian).
