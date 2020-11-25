import * as React from 'react';
import IdentityDetail from './IdentityDetail';
import IdentityAvatar from './IdentityAvatar';

export default class SharedIdentity extends React.Component<{
  children: React.ReactNode;
  hideFilters?: boolean;
}> {
  static Detail = IdentityDetail;
  static Avatar = IdentityAvatar;

  render() {
    return null;
  }
}
