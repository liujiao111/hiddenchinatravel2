const notes = [
  ["01", "Altitude", "Yunnan is a mountain plateau. Most places sit at a moderate elevation, and some are high. Lijiang is about 2,400 meters (7,900 feet), and Shangri-La about 3,400 meters (11,200 feet). If your route includes either, prepare for the altitude."],
  ["02", "Sun", "The elevation makes the ultraviolet light strong in every season. Bring a hat, sunglasses, and sunscreen."],
  ["03", "Clothing", "The temperature can swing sharply, sometimes through several seasons in a single day. Dress in layers so you can add or remove a piece as it changes."],
  ["04", "Local custom", "Yunnan is home to more ethnic groups than any other province in China, and customs differ from place to place. During visits, follow local practice and treat people’s homes, temples, and ceremonies with respect."],
  ["05", "Food", "The cooking changes with the region. Dishes worth seeking out include crossing-the-bridge rice noodles, Xuanwei ham, flower cakes, Dai-style rice eaten by hand, and steam-pot chicken."],
] as const;

export function YunnanTravelNotes() {
  return <section className="journey-yunnan-notes section" id="yunnan-notes" aria-labelledby="yunnan-notes-title"><div className="shell">
    <header className="journey-yunnan-notes-heading">
      <h2 id="yunnan-notes-title">A few things to know about Yunnan.</h2>
      <p>Elevation, sun, clothing, custom, and food — the same on both routes.</p>
    </header>
    <div className="journey-yunnan-notes-grid">
      {notes.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
    </div>
  </div></section>;
}
