/**
 * Config del subproyecto de video. Sólo aplica a la CLI (`remotion studio`,
 * `remotion render`); si algún día se renderiza vía las APIs de Node.js hay que
 * pasar estas opciones a mano.
 *
 * Referencia: https://remotion.dev/docs/config
 */

import { Config } from '@remotion/cli/config';

// H.264 y no VP9. El VP9 que sale de este pipeline carga la metadata pero se
// cae al decodificar en Chrome (PIPELINE_ERROR_DECODE tras un solo frame),
// mientras que el H.264 decodifica limpio y ademas lo soporta Safari.
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

Config.setRspack(true);
