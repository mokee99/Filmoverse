
const projectId = "tt3t3v69";
const dataset = "production";
const apiVersion = "2025-02-19";

const apiUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;

export async function fetchFromSanity(query, params = {}) {
  try {
    const url = new URL(apiUrl);

    url.searchParams.set("query", query);

    // Add GROQ parameters when provided
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.status}`);
    }

    const data = await response.json();

    return data.result;

  } catch (error) {
    console.error("Failed to fetch Sanity data:", error);
    throw error;
  }
}
