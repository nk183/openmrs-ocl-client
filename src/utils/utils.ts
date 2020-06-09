import { LOCALES } from "./constants";
import { snakeCase } from "lodash";

export const findLocale = (localeCode: string, fallback = "en") =>
  LOCALES.find(currentLocale => currentLocale.value === localeCode) ||
  (LOCALES.find(currentLocale => currentLocale.value === fallback) as {
    [key: string]: string;
  });

export const STATUS_CODES_TO_MESSAGES: { [key: number]: string } = {
  // if this map starts growing big, try to find more standardized language
  403: "You don't have permission to do this",
  404: "Could not find that resource"
};

const MESSAGES_TO_STATUS_CODES: { [key: string]: number } = Object.entries(
  // todo reformat this to use lodash's invert
  STATUS_CODES_TO_MESSAGES
).reduce<{ [key: string]: number }>(
  (result, [key, value]) => ({ ...result, [value]: parseInt(key) }),
  {}
);

export const getPrettyError = (
  errors: { [key: string]: string[] | undefined } | undefined | string,
  field?: string
) => {
  if (!errors) return;

  if (typeof errors === "string") return field ? undefined : errors;

  const errorList: string[] | undefined = field
    ? errors[field]
    : errors["__all__"];
  if (!errorList) return;

  return errorList.join(", ");
};

export function getCustomErrorMessage(
  errorMessage: string | undefined,
  statusCodesWeCareAbout: { [key: number]: string }
) {
  const statusCode = errorMessage
    ? MESSAGES_TO_STATUS_CODES[errorMessage]
    : undefined;
  const statusMessage = statusCode
    ? statusCodesWeCareAbout[statusCode]
    : undefined;
  return statusMessage || errorMessage;
}

export const keysToSnakeCase = (item?: any) => {
  const isArray = (a: any) => {
    return Array.isArray(a);
  };

  const isObject = (o: any) => {
    return o === Object(o) && !isArray(o) && typeof o !== "function";
  };

  if (isObject(item)) {
    const newItem: { [key: string]: any } = {};

    Object.keys(item).forEach(k => {
      newItem[snakeCase(k)] = keysToSnakeCase(item[k]);
    });

    return newItem;
  } else if (isArray(item)) {
    return item.map((i: any) => {
      return keysToSnakeCase(i);
    });
  }

  return item;
};

export const buildPartialSearchQuery = (query: string): string =>
  `${query.replace(new RegExp(" ", "g"), "* ")}*`;

export const delay = (seconds: number) =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000));

export function debug(...messages: string[]) {
  console.log(messages);
}
