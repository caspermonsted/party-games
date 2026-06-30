export async function generateCategory(categoryName, lang) {
  const isDA = lang === 'da'

  const systemMsg = isDA
    ? 'Du genererer ord til et partyspil. Svar KUN med et JSON array.'
    : 'You generate words for a party game. Reply ONLY with a JSON array.'

  const userMsg = isDA
    ? `Lav 8 ord til kategorien "${categoryName}". Hvert ord skal have et enkelt hint-ord der er INDIREKTE relateret (ikke selve ordet). Format: [{"word":"...","hint":"..."}]`
    : `Generate 8 words for the category "${categoryName}". Each word needs a single hint word that is INDIRECTLY related (not the word itself). Format: [{"word":"...","hint":"..."}]`

  // Prøv POST endpoint
  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user', content: userMsg },
        ],
        model: 'openai',
        jsonMode: true,
        seed: Math.floor(Math.random() * 9999),
      }),
      signal: AbortSignal.timeout(20000),
    })

    const text = (await res.text()).trim()
    return parseWords(text)
  } catch (e) {
    console.warn('POST failed, trying GET:', e.message)
  }

  // Fallback: GET endpoint med kort prompt
  const shortPrompt = isDA
    ? `Lav 8 ord til "${categoryName}" som enkelt JSON array med word og hint. Hint er et indirekte enkelt ord.`
    : `8 words for "${categoryName}" as JSON array with word and hint fields. Hint is one indirect word.`

  const url = `https://text.pollinations.ai/${encodeURIComponent(shortPrompt)}?json=true&seed=${Math.floor(Math.random() * 9999)}`
  const res2 = await fetch(url, { signal: AbortSignal.timeout(20000) })
  const text2 = (await res2.text()).trim()
  return parseWords(text2)
}

function parseWords(text) {
  const match = text.match(/\[[\s\S]*?\]/)
  if (!match) throw new Error('No JSON array found in response')
  const words = JSON.parse(match[0])
  if (!Array.isArray(words) || words.length === 0) throw new Error('Empty word list')
  return words
    .filter(w => w.word && w.hint)
    .map(w => ({ word: String(w.word).trim(), hint: String(w.hint).trim() }))
}
