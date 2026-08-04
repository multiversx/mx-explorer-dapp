export interface ConverterValidate {
  required: string;
  test?: {
    error: string;
    callback: (value: string | undefined) => boolean;
  };
}

export interface ConverterType {
  name: string;
  title: string;
  label: string;
  identifier: string;
  compute: (value: string) => string;
  validate: ConverterValidate;
}
