export interface IconProps {
  size?: number;
  fill?: string;
}

const Icon = ({
  size = 24,
  fill = 'currentColor',
  d,
}: IconProps & { d: string }) => {
  return (
    <svg
      viewBox='0 0 24 24'
      fill={fill}
      width={`${size}px`}
      height={`${size}px`}
    >
      <path d={d} />
    </svg>
  );
};

export default Icon;
