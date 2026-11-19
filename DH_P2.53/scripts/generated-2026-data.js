// Generated snapshots share a small, fresh manifest. The data files are
// named from their content so the service worker can reuse an exact version.
const manifestUrl = new URL('../data/generated-2026/index.json', import.meta.url);
const manifests = new WeakMap();

export function load2026DataManifest(fetchImpl = globalThis.fetch) {
  if (!manifests.has(fetchImpl)) {
    const pending = (async () => {
      const response = await fetchImpl(manifestUrl, { cache: 'no-store' });
      // A source-only static preview has no build output. Its page loaders
      // can still read the same maintained CSVs from the checkout.
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`2026 data manifest could not load (${response.status}).`);
      return response.json();
    })().catch(error => {
      manifests.delete(fetchImpl);
      throw error;
    });
    manifests.set(fetchImpl, pending);
  }
  return manifests.get(fetchImpl);
}

export async function loadGenerated2026Data(name, fetchImpl = globalThis.fetch) {
  const manifest = await load2026DataManifest(fetchImpl);
  if (!manifest) return null;
  const file = manifest.files?.[name];
  if (!/^[a-z]+-[0-9a-f]{16}\.json$/.test(file)) throw new Error(`Missing generated 2026 data for ${name}.`);
  const response = await fetchImpl(new URL(file, manifestUrl));
  if (!response.ok) throw new Error(`2026 ${name} data could not load (${response.status}).`);
  return response.json();
}
