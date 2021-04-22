import * as React from 'react';
import IdentityCard from './IdentityCard';
import IdentityAvatar from './IdentityAvatar';
import IdentitySummary from './IdentitySummary';

export default class SharedIdentity extends React.Component<{
  children: React.ReactNode;
}> {
  static Card = IdentityCard;
  static Avatar = IdentityAvatar;
  static Summary = IdentitySummary;

  render() {
    return null;
  }
}
