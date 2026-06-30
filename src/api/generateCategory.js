export async function generateCategory(categoryName, lang) {
  const res = await fetch('/api/generate-category', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: categoryName, lang }),
    signal: AbortSignal.timeout(20000),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to generate')
  if (!data.words || data.words.length === 0) throw new Error('No words returned')
  return data.words
}
