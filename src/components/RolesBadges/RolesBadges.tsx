import { PropertyPill } from 'components';

export const RolesBadges = (props: {
  canUpgrade?: boolean;
  canChangeOwner?: boolean;
  canTransfer?: boolean;
  canMint?: boolean;
  canBurn?: boolean;
  canPause?: boolean;
  isPaused?: boolean;
  canFreeze?: boolean;
  canWipe?: boolean;
  canTransferNftCreateRole?: boolean;
  canAddSpecialRoles?: boolean;
}) => {
  return (
    <div className='d-flex alig-items-center flex-wrap gap-2 mt-1 mt-lg-0'>
      {props?.canUpgrade !== undefined && (
        <PropertyPill name={'Can Upgrade'} active={Boolean(props.canUpgrade)} />
      )}
      {props?.canChangeOwner !== undefined && (
        <PropertyPill
          name={'Can Change Owner'}
          active={Boolean(props.canChangeOwner)}
        />
      )}
      {props?.canTransfer !== undefined && (
        <PropertyPill
          name={'Can Transfer'}
          active={Boolean(props.canTransfer)}
        />
      )}
      {props?.canPause !== undefined && (
        <PropertyPill name={'Can Pause'} active={Boolean(props.canPause)} />
      )}
      {props?.isPaused !== undefined && (
        <PropertyPill name={'Not Paused'} active={Boolean(!props.isPaused)} />
      )}
      {props?.canFreeze !== undefined && (
        <PropertyPill name={'Can Freeze'} active={Boolean(props.canFreeze)} />
      )}
      {props?.canWipe !== undefined && (
        <PropertyPill name={'Can Wipe'} active={Boolean(props.canWipe)} />
      )}
      {props?.canTransferNftCreateRole !== undefined && (
        <PropertyPill
          name={'Can Transfer NFT Create Role'}
          active={Boolean(props.canTransferNftCreateRole)}
        />
      )}
      {props?.canAddSpecialRoles !== undefined && (
        <PropertyPill
          name={'Can Add Special Role'}
          active={Boolean(props.canAddSpecialRoles)}
        />
      )}
    </div>
  );
};
