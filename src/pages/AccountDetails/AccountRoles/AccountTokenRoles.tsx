import React from 'react';
import { AccountRolesTypeEnum } from 'types';
import { AccountRoles } from './AccountRoles';

export const AccountTokenRoles = () => (
  <AccountRoles type={AccountRolesTypeEnum.tokens} />
);
