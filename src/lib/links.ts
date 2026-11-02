import { site } from '../config/site';

export function whatsappHref(message: string = site.whatsappMessage): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Mensaje de cita con tratamiento y horario (misma lógica que usa el script del formulario). */
export function appointmentMessage(treatment: string, time = 'por confirmar'): string {
  return site.whatsappTemplate.replace('{tratamiento}', treatment).replace('{horario}', time);
}

export const telHref = `tel:${site.phoneHref}`;
export const mailHref = `mailto:${site.email}`;

export const mapsSearchHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`;
export const mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;
