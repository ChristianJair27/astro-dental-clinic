<?php
// Copia a lead-config.php y súbelo al directorio PADRE de public_html (no accesible por web).
// lead-config.php está en .gitignore: nunca lo commitees.
return [
    'to' => 'TODO-CLIENTE@dominio.com',       // quién recibe los leads
    'from' => 'no-reply@dominio-del-sitio.com', // buzón del MISMO dominio (SPF/DKIM)
    'subject_prefix' => 'Nueva solicitud de cita',
    'dry_run' => '0',
];
