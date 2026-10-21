const projectId = 'tt3t3v69';
const dataset = 'production';
const apiVersion = '2025-02-19';

const apiUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;

export async function fetchFromSanity(query) {
  try {
    const url = `${apiUrl}?query=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.status}`);
    }

    const data = await response.json();

    return data.result;
  } catch (error) {
    console.error('Failed to fetch Sanity data:', error);
    throw error;
  }
}