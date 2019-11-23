export interface Option {
  label: string;
  value: string;
}

export interface OptionResponse{
  options: Option[],
  hasMore: boolean,
  additional: {},
}

export interface BaseConceptContainer {
  name: string;
  short_code: string;
  description: string;
  public_access: string;
  default_locale: string;
}

export {};
