import React from 'react';
import { Download } from 'lucide-react';
import { 
  UX_LAWS_DATA, 
  GLOSSARY_TERMS, 
  GESTALT_PRINCIPLES, 
  ISO_PRINCIPLES, 
  NIELSEN_HEURISTICS, 
  LITERATURE_ITEMS, 
  LEARNING_GUIDE_2026 
} from '../constants';

export const ContentDownload: React.FC = () => {
  const generateText = () => {
    let text = "UX LERNPLATTFORM - VOLLSTÄNDIGER INHALT\n";
    text += "=======================================\n\n";
    text += "Generiert am: " + new Date().toLocaleDateString('de-DE') + "\n\n";

    // --- NAVIGATION STRUCTURE ---
    text += "STRUKTUR DER WEBSEITE\n";
    text += "---------------------\n";
    text += "1. HOME (Startseite)\n";
    text += "2. THEORIE & STANDARDS\n";
    text += "   - Grundlagen (Usability vs UX)\n";
    text += "   - Heuristiken (Nielsen)\n";
    text += "   - Gestaltgesetze\n";
    text += "   - UX Grundsätze (Gesetze)\n";
    text += "   - Wahrnehmung (Psychologie)\n";
    text += "   - ISO Normen (9241)\n";
    text += "   - Barrierefreiheit\n";
    text += "3. PRAXIS & METHODEN\n";
    text += "   - Design Methoden\n";
    text += "   - Evaluation\n";
    text += "   - UX & KI\n";
    text += "4. CAMPUS & INTERAKTIV\n";
    text += "   - Bad UI Lab\n";
    text += "   - Quiz\n";
    text += "   - Literatur\n";
    text += "   - Glossar\n\n";

    text += "=======================================\n";
    text += "DETAILLIERTE INHALTE\n";
    text += "=======================================\n\n";

    // --- HOME ---
    text += "SEITE: HOME\n";
    text += "-----------\n";
    text += "Headline: UX-Design Lernen - Barrierefreiheit & UX\n";
    text += "Subtext: Lernmodul 06\n\n";

    // --- GRUNDLAGEN ---
    text += "SEITE: GRUNDLAGEN\n";
    text += "-----------------\n";
    text += "Headline: Grundlagen Usability & UX\n";
    text += "Intro: Bevor wir in die Tiefe gehen, müssen wir die Begriffe klären. Was macht ein Produkt benutzbar? Und was macht es zu einem Erlebnis?\n\n";
    
    text += "1. Usability vs. User Experience\n";
    text += "   Usability (Gebrauchstauglichkeit): Der objektive, funktionale Teil. Bezieht sich darauf, wie effektiv, effizient und zufriedenstellend bestimmte Nutzende bestimmte Ziele in einem bestimmten Nutzungskontext erreichen können (ISO 9241-11). Frage: „Funktioniert es? Kann ich es bedienen?“\n";
    text += "   User Experience (UX): Der subjektive, emotionale Teil. Umfasst alle Aspekte der Erfahrungen der Nutzenden bei der Interaktion mit einem Produkt, Dienst oder System. Dazu gehören Emotionen, Vorstellungen, Vorlieben und körperliche Reaktionen (ISO 9241-210). Frage: „Wie fühlt es sich an? Macht es Spaß?“\n\n";
    
    text += "2. Die 4 Säulen (Visual)\n";
    text += "   - Nützlichkeit: Erfüllt Bedürfnisse & löst Probleme\n";
    text += "   - Ästhetik: Visuelles Design & Anmutung\n";
    text += "   - Vertrauen: Glaubwürdigkeit & Sicherheit\n";
    text += "   - Usability: Bedienbarkeit, Zugänglichkeit, Übersichtlichkeit, Fehlertoleranz\n\n";
    
    text += "3. Innere Faktoren\n";
    text += "   - Kontext: Zeit, Ort, Gerät, Umgebung\n";
    text += "   - Inhalt: Relevanz, Qualität, Verständlichkeit\n";
    text += "   - Emotionen: Freude, Neugier, Erwartung\n\n";

    text += "4. Die 5 Komponenten der Usability (nach Nielsen)\n";
    text += "   - Learnability: Wie einfach können Nutzende grundlegende Aufgaben erledigen, wenn sie das Design zum ersten Mal sehen?\n";
    text += "   - Efficiency: Wenn Nutzende das Design gelernt haben, wie schnell können sie Aufgaben erledigen?\n";
    text += "   - Memorability: Wenn Nutzende nach einer Pause zurückkehren, wie leicht finden sie sich wieder zurecht?\n";
    text += "   - Errors: Wie viele Fehler machen Nutzende, wie schwerwiegend sind sie und wie leicht können sie behoben werden?\n";
    text += "   - Satisfaction: Wie angenehm ist die Nutzung des Designs?\n\n";

    text += "5. Der Zeit-Faktor\n";
    text += "   - Vor der Nutzung (Antizipierte UX): Erwartungen, Markenimage.\n";
    text += "   - Während der Nutzung (Momentane UX): Effektive Bedienung, Flow.\n";
    text += "   - Nach der Nutzung (Episodische UX): Reflexion, Erinnerung.\n\n";

    // --- HEURISTIKEN ---
    text += "SEITE: HEURISTIKEN (NIELSEN'S 10 PRINZIPIEN)\n";
    text += "--------------------------------------------\n";
    NIELSEN_HEURISTICS.forEach(h => {
      text += `Nr. ${h.id}: ${h.title}\n`;
      text += `Beschreibung: ${h.description}\n`;
      text += `Beispiel: ${h.example}\n\n`;
    });

    // --- GESTALTGESETZE ---
    text += "SEITE: GESTALTGESETZE\n";
    text += "---------------------\n";
    GESTALT_PRINCIPLES.forEach(g => {
      text += `Gesetz: ${g.name}\n`;
      text += `Beschreibung: ${g.detailedDescription}\n`;
      text += "Beispiele:\n";
      g.examples.forEach(ex => {
        text += `  - ${ex.context}: ${ex.title} (${ex.description})\n`;
      });
      text += "\n";
    });

    // --- UX LAWS ---
    text += "SEITE: UX GRUNDSÄTZE\n";
    text += "--------------------\n";
    UX_LAWS_DATA.forEach(law => {
      text += `Gesetz: ${law.name} (${law.category})\n`;
      text += `Beschreibung: ${law.description}\n`;
      text += `Takeaway: ${law.takeaway}\n\n`;
    });

    // --- ISO NORMEN ---
    text += "SEITE: ISO NORMEN (DIN EN ISO 9241)\n";
    text += "-----------------------------------\n";
    text += "Teil 11: Definition der Gebrauchstauglichkeit (ISO 9241-11)\n\n";
    text += "Teil 110: Interaktionsprinzipien (ISO 9241-110)\n";
    ISO_PRINCIPLES.forEach(iso => {
      text += `Grundsatz ${iso.id}: ${iso.title} (${iso.englishTitle})\n`;
      text += `Beschreibung: ${iso.description}\n`;
      text += `Beispiel: ${iso.example}\n\n`;
    });

    // --- GLOSSAR ---
    text += "SEITE: GLOSSAR\n";
    text += "--------------\n";
    const sortedGlossary = [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term));
    sortedGlossary.forEach(term => {
      text += `${term.term} [${term.category}]: ${term.definition}\n`;
    });
    text += "\n";

    // --- LITERATUR ---
    text += "SEITE: LITERATUR & QUELLEN\n";
    text += "--------------------------\n";
    LITERATURE_ITEMS.forEach(book => {
      text += `Titel: ${book.title}\n`;
      text += `Verfasst von: ${book.author} (${book.year})\n`;
      text += `Beschreibung: ${book.description}\n`;
      text += `Kategorie: ${book.category}\n\n`;
    });
    
    text += "ONLINE GUIDES 2026\n";
    LEARNING_GUIDE_2026.forEach(section => {
      text += `Phase: ${section.title}\n`;
      text += `Info: ${section.description}\n`;
      section.resources.forEach(res => {
         text += `  - ${res.title}: ${res.description} (${res.url})\n`;
      });
      text += "\n";
    });

    return text;
  };

  const handleDownload = () => {
    const text = generateText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ux-lernplattform-inhalte.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 text-[10px] text-stone-500 hover:text-orange-500 transition-colors mt-2"
      title="Alle Inhalte als Text herunterladen"
    >
      <Download size={12} />
      <span>Inhalte exportieren (.txt)</span>
    </button>
  );
};
