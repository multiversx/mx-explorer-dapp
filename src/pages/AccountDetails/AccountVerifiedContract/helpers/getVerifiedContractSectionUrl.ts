import { urlBuilder } from 'helpers';
import { VerifiedContractTabsEnum } from 'lib';

export const getVerifiedContractSectionUrl = (
  activeSection: VerifiedContractTabsEnum,
  address: string
) => {
  switch (activeSection) {
    case VerifiedContractTabsEnum.details:
      return urlBuilder.accountDetailsContractCodeDetails(address);
    case VerifiedContractTabsEnum.sourceCode:
      return urlBuilder.accountDetailsContractCodeSource(address);
    case VerifiedContractTabsEnum.endpoints:
      return urlBuilder.accountDetailsContractCodeEndpointsRead(address);
    case VerifiedContractTabsEnum.readEndpoints:
      return urlBuilder.accountDetailsContractCodeEndpointsRead(address);
    case VerifiedContractTabsEnum.writeEndpoints:
      return urlBuilder.accountDetailsContractCodeEndpointsWrite(address);
    case VerifiedContractTabsEnum.events:
      return urlBuilder.accountDetailsContractCodeEvents(address);
    case VerifiedContractTabsEnum.types:
      return urlBuilder.accountDetailsContractCodeTypes(address);
    case VerifiedContractTabsEnum.contractConstructor:
      return urlBuilder.accountDetailsContractCodeConstructor(address);
    default:
      return urlBuilder.accountDetailsContractCodeDetails(address);
  }
};
