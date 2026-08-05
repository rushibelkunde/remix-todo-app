// app/utils/form-helpers.ts
// Utility functions for parsing and extracting Remix form data.

/**
 * Parses request form data and returns a plain object.
 * NOTE: Call this only once per request — formData() stream can only be read once.
 */
export async function parseFormData(
  request: Request
): Promise<Record<string, string>> {
  const formData = await request.formData();
  return Object.fromEntries(formData) as Record<string, string>;
}

/**
 * Returns the value of a required form field.
 * Throws a descriptive error if the field is missing or empty.
 */
export function getRequiredField(
  form: Record<string, string>,
  field: string
): string {
  const value = form[field];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required form field: "${field}"`);
  }
  return value.trim();
}

/**
 * Returns the value of an optional form field, or null if absent.
 */
export function getOptionalField(
  form: Record<string, string>,
  field: string
): string | null {
  const value = form[field];
  return value && value.trim() !== "" ? value.trim() : null;
}

/**
 * Parses a boolean string from a form field ("true" / "false").
 */
export function parseBooleanField(
  form: Record<string, string>,
  field: string
): boolean {
  return form[field] === "true";
}
