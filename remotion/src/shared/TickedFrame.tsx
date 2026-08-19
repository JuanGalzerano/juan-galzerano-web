import type { CSSProperties, ReactNode } from 'react';
import { colors, effects } from '../theme';

type Props = {
  readonly children?: ReactNode;
  /**
   * El `.ticked` del sitio sólo marca dos esquinas (arriba-izquierda con
   * ::before y abajo-derecha con ::after). `all` marca las cuatro.
   */
  readonly all?: boolean;
  /** Filete alrededor del panel. El `.ticked` del sitio no lo dibuja. */
  readonly border?: boolean;
  readonly color?: string;
  readonly opacity?: number;
  readonly size?: number;
  readonly style?: CSSProperties;
};

const CORNER: CSSProperties = {
  position: 'absolute',
  borderColor: 'inherit',
  borderStyle: 'solid',
  borderWidth: 0,
};

/**
 * Clase `.ticked` del sitio: marcas de registro de dibujante en las esquinas
 * de un panel. 9px, borde de 1px en color draft, opacity 0.55.
 */
export const TickedFrame: React.FC<Props> = ({
  children,
  all = false,
  border = false,
  color = colors.draft,
  opacity = effects.tickOpacity,
  size = effects.tickSize,
  style,
}) => {
  const w = effects.tickWidth;
  const off = -w;

  return (
    <div
      style={{
        position: 'relative',
        border: border ? `${w}px solid ${colors.line}` : undefined,
        ...style,
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderColor: color,
          opacity,
        }}
      >
        {/* ::before — arriba a la izquierda */}
        <div
          style={{
            ...CORNER,
            top: off,
            left: off,
            width: size,
            height: size,
            borderTopWidth: w,
            borderLeftWidth: w,
          }}
        />
        {/* ::after — abajo a la derecha */}
        <div
          style={{
            ...CORNER,
            bottom: off,
            right: off,
            width: size,
            height: size,
            borderBottomWidth: w,
            borderRightWidth: w,
          }}
        />
        {all ? (
          <>
            <div
              style={{
                ...CORNER,
                top: off,
                right: off,
                width: size,
                height: size,
                borderTopWidth: w,
                borderRightWidth: w,
              }}
            />
            <div
              style={{
                ...CORNER,
                bottom: off,
                left: off,
                width: size,
                height: size,
                borderBottomWidth: w,
                borderLeftWidth: w,
              }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};
