/**
 * Config del subproyecto de video. Sólo aplica a la CLI (`remotion studio`,
 * `remotion render`); si algún día se renderiza vía las APIs de Node.js hay que
 * pasar estas opciones a mano.
 *
 * Referencia: https://remotion.dev/docs/config
 */

import { Config } from '@remotion/cli/config';

// El sitio consume el video como .webm: VP9 mantiene el archivo chico y soporta
// canal alfa si en algún momento se necesita superponerlo sobre el fondo.
Config.setCodec('vp9');
Config.setPixelFormat('yuv420p');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

Config.setRspack(true);
