/** @deprecated Use getValidationSchemas() for runtime validation with i18n messages. */
export type { TourInput, TourDepartureInput } from "./schemas";

export {
  buildValidationSchemas,
  type TourInput as TourInputType,
} from "./schemas";
