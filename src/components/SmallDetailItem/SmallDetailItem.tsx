export const SmallDetailItem = ({
  children,
  title
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
}) => (
  <div className='row py-3 border-bottom detail-item'>
    <div className='col-lg-3 text-neutral-400 ps-lg-spacer pe-lg-0'>
      {title}
    </div>
    <div className='col-lg-9 pe-lg-spacer ps-lg-0'>{children}</div>
  </div>
);
