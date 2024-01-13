export const HeroDetailItem = ({
  children,
  title
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
}) => {
  if (!(title || children)) {
    return null;
  }

  return (
    <div className='row'>
      <div className='col-lg-2 text-neutral-400'>{title}</div>
      <div className='col-lg-10'>
        <div className='d-flex align-items-center'>{children}</div>
      </div>
    </div>
  );
};
