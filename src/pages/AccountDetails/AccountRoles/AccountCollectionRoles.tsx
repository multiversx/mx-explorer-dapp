import React from 'react';
import { AccountRolesTypeEnum } from 'types';
import { AccountRoles } from './AccountRoles';

export const AccountCollectionRoles = () => (
  <AccountRoles type={AccountRolesTypeEnum.collections} />
);
