export interface IconProps {
  className?: string;
  fill?: string;
}

const Icon = ({
  className,
  fill = 'currentColor',
  d,
}: IconProps & { d: string }) => {
  return (
    <div className={className ? className : 'h-6 w-6 md:h-8 md:w-8'}>
      <svg viewBox='0 0 24 24' fill={fill} width='100%' height='100%'>
        <path d={d} />
      </svg>
    </div>
  );
};

export default Icon;
