export const ApplicationDetailItem = ({
  children,
  title
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
}) => (
  <div className='row'>
    <div className='col-lg-2 text-neutral-400'>{title}</div>
    <div className='col-lg-10'>{children}</div>
  </div>
);
