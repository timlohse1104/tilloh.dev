export const defaultPreset = {
  Folders: [
    {
      id: crypto.randomUUID(),
      folderName: 'Wissen',
      links: [
        {
          id: crypto.randomUUID(),
          linkName: 'Wikipedia',
          linkUrl: 'https://wikipedia.org',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Google Scholar',
          linkUrl: 'https://scholar.google.de/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Duden',
          linkUrl: 'https://www.duden.de/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Dict.cc',
          linkUrl: 'https://www.dict.cc/',
        },
      ],
      customBackgroundColor: { r: 11, g: 127, b: 55, a: 0.8 },
    },
    {
      id: crypto.randomUUID(),
      folderName: 'Suchen',
      links: [
        {
          id: crypto.randomUUID(),
          linkName: 'Ecosia',
          linkUrl: 'https://www.ecosia.org/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'DuckDuckGo',
          linkUrl: 'https://duckduckgo.com/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Google',
          linkUrl: 'https://google.de',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Bing',
          linkUrl: 'https://www.bing.com/',
        },
      ],
      customBackgroundColor: { r: 123, g: 127, b: 11, a: 0.8 },
    },
    {
      id: crypto.randomUUID(),
      folderName: 'Assistants',
      links: [
        {
          id: crypto.randomUUID(),
          linkName: 'Mistral',
          linkUrl: 'https://mistral.ai/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'OpenAI',
          linkUrl: 'https://openai.com/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Claude',
          linkUrl: 'https://claude.ai',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Deepl',
          linkUrl: 'https://www.deepl.com/en/translator',
        },
      ],
      customBackgroundColor: { r: 11, g: 42, b: 127, a: 0.8 },
    },
    {
      id: crypto.randomUUID(),
      folderName: 'Einkaufen',
      links: [
        {
          id: crypto.randomUUID(),
          linkName: 'Otto',
          linkUrl: 'https://otto.de',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Momox Fashion',
          linkUrl: 'https://www.momoxfashion.com/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Kleinanzeigen',
          linkUrl: 'https://www.kleinanzeigen.de/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Amazon',
          linkUrl: 'https://www.amazon.de/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'eBay',
          linkUrl: 'https://www.ebay.de/',
        },
      ],
      customBackgroundColor: { r: 127, g: 11, b: 28, a: 0.8 },
    },
    {
      id: crypto.randomUUID(),
      folderName: 'Geld',
      links: [
        {
          id: crypto.randomUUID(),
          linkName: 'Sparkasse',
          linkUrl: 'https://www.sparkasse.de/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Volksbanken Raiffeisenbanken',
          linkUrl: 'https://www.vr.de/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Ethikbank',
          linkUrl: 'https://www.ethikbank.de/',
        },
      ],
      customBackgroundColor: { r: 22, g: 111, b: 129, a: 0.8 },
    },
    {
      id: crypto.randomUUID(),
      folderName: 'Nachrichten',
      links: [
        {
          id: crypto.randomUUID(),
          linkName: 'Hackernews',
          linkUrl: 'https://news.ycombinator.com/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Euronews',
          linkUrl: 'https://de.euronews.com/',
        },
        {
          id: crypto.randomUUID(),
          linkName: 'Kieler Nachrichten',
          linkUrl: 'https://www.kn-online.de/',
        },
      ],
      customBackgroundColor: { r: 62, g: 19, b: 94, a: 0.8 },
    },
  ],
};
