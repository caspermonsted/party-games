export async function generateCategory(categoryName, lang) {
  const isDA = lang === 'da'

  const prompt = isDA
    ? `Du laver ord til et partyspil kaldet Imposter Game. Én spiller er imposteren og får et hint-ord i stedet for det rigtige ord.

Lav 10 ord til kategorien: "${categoryName}"

Regler:
- Hint = ét enkelt ord, indirekte relateret til ordet
- Hint må ikke være selve ordet
- Eks: ord="Pikachu" hint="Strøm", ord="Charizard" hint="Flamme"

Svar KUN med JSON array:
[{"word":"...","hint":"..."}]`
    : `Generate 10 words for the Imposter Game party game. Category: "${categoryName}"

Rules:
- Each entry has a word and a one-word hint
- Hint must be indirectly related (not the word itself)
- E.g.: word="Pikachu" hint="Electricity", word="Charizard" hint="Flame"

Reply ONLY with a JSON array:
[{"word":"...","hint":"..."}]`

  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai-large&json=true&seed=${Math.floor(Math.random() * 9999)}`

  const res = await fetch(url, { signal: AbortSignal.timeout(25000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const text = (await res.text()).trim()
  const match = text.match(/\[[\s\S]*?\]/)
  if (!match) throw new Error('No JSON found')

  const words = JSON.parse(match[0])
  if (!Array.isArray(words) || words.length === 0) throw new Error('Empty')

  return words
    .filter(w => w.word && w.hint)
    .map(w => ({ word: String(w.word).trim(), hint: String(w.hint).trim() }))
}
