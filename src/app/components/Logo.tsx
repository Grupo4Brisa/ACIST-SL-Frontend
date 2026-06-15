import logoImg from '../../imports/Logo_ACIST_pdf.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  theme?: 'light' | 'dark';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: { height: 'h-10' },
    md: { height: 'h-14' },
    lg: { height: 'h-20' }
  };

  const currentSize = sizes[size];

  return (
    <img
      src={logoImg}
      alt="ACIST São Leopoldo"
      className={`${currentSize.height} w-auto object-contain`}
    />
  );
}
