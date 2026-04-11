function parseClaims(claims) {
  if (!claims) return [];

  return claims
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);
}

function generateSlug(productName) {
  if (!productName) return 'unknown-product';

  return productName
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function buildIllustratorMetadata(productName) {
  return {
    layer: "Artwork_Layer",
    bounds: {
      x: 100,
      y: 250,
      width: 400
    },
    slug: generateSlug(productName)
  };
}

export function transformToDesignData(raw) {
  return {
    product_name: raw.product_name,
    flavor: raw.flavor,
    weight: raw.weight,
    brand_color: raw.brand_color,

    claims: parseClaims(raw.claims),

    textColor: "#FFFFFF",

    illustrator_metadata: buildIllustratorMetadata(raw.product_name),

    generated_at: new Date().toISOString()
  };
}