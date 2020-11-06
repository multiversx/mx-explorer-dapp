import { trimHash } from 'helpers';
import { BrandType } from 'context/state';
import { ValidatorType } from 'context/validators';

interface BrandServerResponseType {
  name: string;
  avatar?: string;
  identity: string;
  twitter?: string;
  web?: string;
  location?: string;
  validators: number;
}
