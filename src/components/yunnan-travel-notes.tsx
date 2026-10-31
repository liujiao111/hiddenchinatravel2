import { useTranslations } from "next-intl";

export function YunnanTravelNotes() {
  const t = useTranslations("journey");
  const notes = t.raw("yunnanNotes") as { title: string; copy: string }[];
  return <section className="journey-yunnan-notes section" id="yunnan-notes" aria-labelledby="yunnan-notes-title"><div className="shell">
    <header className="journey-yunnan-notes-heading">
      <h2 id="yunnan-notes-title">{t("yunnanNotesHeading")}</h2>
      <p>{t("yunnanNotesSub")}</p>
    </header>
    <div className="journey-yunnan-notes-grid">
      {notes.map((note, index) => <article key={note.title}><span>0{index + 1}</span><h3>{note.title}</h3><p>{note.copy}</p></article>)}
    </div>
  </div></section>;
}
