import classNames from 'classnames';

export const NftProofBadge = ({ className }: { className?: string }) => {
  return (
    <div className={classNames('badge badge-green text-green-100', className)}>
      Proof
    </div>
  );
};
