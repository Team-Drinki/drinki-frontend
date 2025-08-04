import SvgWrapper from './SvgWrapper';

interface StarProps {
  variant?: 'empty' | 'full' | 'half';
  size?: number;
}

export default function Star({ variant = 'empty', size = 23 }: StarProps) {
  if (variant === 'empty') {
    return (
      <SvgWrapper size={size} viewBox="0 0 23 21" color="var(--color-grey-200)">
        <path d="M11.5711 0L14.137 7.89695H22.4404L15.7228 12.7775L18.2887 20.6745L11.5711 15.7939L4.8536 20.6745L7.41948 12.7775L0.701932 7.89695H9.00528L11.5711 0Z" />
      </SvgWrapper>
    );
  } else if (variant === 'full') {
    return (
      <SvgWrapper size={size} viewBox="0 0 23 21" color="var(--color-brown)">
        <path d="M11.5711 0L14.137 7.89695H22.4404L15.7228 12.7775L18.2887 20.6745L11.5711 15.7939L4.8536 20.6745L7.41948 12.7775L0.701932 7.89695H9.00528L11.5711 0Z" />
      </SvgWrapper>
    );
  } else {
    return (
      <div className="relative">
        <SvgWrapper size={size} viewBox="0 0 23 21" color="var(--color-grey-200)">
          <path d="M11.5711 0L14.137 7.89695H22.4404L15.7228 12.7775L18.2887 20.6745L11.5711 15.7939L4.8536 20.6745L7.41948 12.7775L0.701932 7.89695H9.00528L11.5711 0Z" />
        </SvgWrapper>
        <div className="absolute top-0 left-0 overflow-hidden w-2/4">
          <SvgWrapper size={size} viewBox="0 0 23 21" color="var(--color-brown)">
            <path d="M11.5711 0L14.137 7.89695H22.4404L15.7228 12.7775L18.2887 20.6745L11.5711 15.7939L4.8536 20.6745L7.41948 12.7775L0.701932 7.89695H9.00528L11.5711 0Z" />
          </SvgWrapper>
        </div>
      </div>
    );
  }
}
