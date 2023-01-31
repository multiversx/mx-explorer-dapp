export interface VerifiedContractType {
  codeHash: string;
  ipfsFileHash: string;
  source: {
    abi: ContractAbiType;
    contract: ContractType;
  };
  status: string;
}

export interface ContractAbiType {
  name: string;
  buildInfo: {
    contractCrate: {
      name: string;
      version: string;
    };
    framework: {
      name: string;
      version: string;
    };
    rustc: {
      channel: string;
      commitDate: string;
      commitHash: string;
      short: string;
      version: string;
    };
  };
  hasCallback: boolean;
  types: any;
  endpoints?: ContractEndpointType[];
  events?: any[];
  ['constructor']?: any;
}

export interface ContractType {
  entries: ContractEntryType[];
  name: string;
  version: string;
}

export interface ContractEntryType {
  content: string;
  path: string;
}

export interface ContractEndpointType {
  name: string;
  mutability?: string;
  onlyOwner?: boolean;
  docs?: string[];
  inputs?: ContractEndpointInputType[];
  outputs?: ContractEndpointOutputType[];
  payableInTokens?: string[];
}

export interface ContractEndpointInputType {
  name: string;
  type: string;
  multi_arg?: boolean;
}

export interface ContractEndpointOutputType {
  type: string;
}
