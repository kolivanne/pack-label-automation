export function validateProduct(product) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!product.product_name) errors.push("Missing product_name");
  if (!product.flavor) errors.push("Missing flavor");
  if (!product.weight) errors.push("Missing weight");

  // Length warning
  if (product.product_name && product.product_name.length > 30) {
    warnings.push("product_name is very long; may truncate in design.");
  }

  // Hex color validation
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!product.brand_color || !hexRegex.test(product.brand_color)) {
    errors.push(`Invalid hex color: ${product.brand_color || "undefined"}`);
  }

  // Claims validation (prepare for PR4 transform)
  const claimsArray = product.claims
    ? product.claims.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  if (claimsArray.length === 0) {
    warnings.push("No marketing claims provided.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    name: product.product_name || "Unknown Product"
  };
}