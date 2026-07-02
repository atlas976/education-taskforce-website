import { describe, expect, it } from "vitest";
import {
  createCertificateContent,
  createCertificatePdf,
  createEnglishCertificateText,
} from "@/lib/domain/certificate";

describe("certificate generation", () => {
  it("generates an English certificate sentence for a participant", () => {
    expect(createEnglishCertificateText({ participantName: "Walter" })).toBe(
      "This certifies that Walter has successfully completed the AI Edutainment course by TUM.ai.",
    );
  });

  it("generates localized certificate content with a course description and no personal quote", () => {
    const german = createCertificateContent({ language: "de", participantName: "Walter" });
    const english = createCertificateContent({ language: "en", participantName: "Walter" });

    expect(german.title).toBe("Zertifikat");
    expect(german.statement).toContain("bestätigt");
    expect(german.description).toContain("KI-Werkzeuge");
    expect(german.description).toContain("präsentiert");
    expect(german.footerLeft).toContain("Fünftägiges");
    expect(german.footerRight).toContain("Universität München");
    expect(german.statement).not.toContain("bestaetigt");
    expect(german.description).not.toContain("praesentiert");
    expect(german.footerLeft).not.toContain("Fuenf");
    expect(german.footerRight).not.toContain("Universitaet");
    expect(english.title).toBe("Certificate");
    expect(english.description).toContain("AI tools");
    expect(german).not.toHaveProperty("quote");
    expect(english).not.toHaveProperty("quote");
  });

  it("builds a downloadable PDF file", () => {
    const pdf = createCertificatePdf({ language: "en", participantName: "Walter" });
    const text = new TextDecoder("latin1").decode(pdf);

    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text).toContain("/Type /Page");
    expect(text.trimEnd().endsWith("%%EOF")).toBe(true);
  });

  it("wraps certificate PDF copy and encodes German umlauts instead of flattening them", () => {
    const pdf = createCertificatePdf({ language: "de", participantName: "Walter" });
    const text = new TextDecoder("latin1").decode(pdf);

    expect(text).toContain("Hiermit wird");
    expect(text).not.toContain(
      "(Hiermit wird best\\344tigt, dass Walter den Kurs AI Edutainment von TUM.ai erfolgreich abgeschlossen hat.) Tj ET",
    );
    expect(text).not.toContain("bestaetigt");
    expect(text).not.toContain("praesentiert");
    expect(text).not.toContain("Universitaet");
    expect(text).not.toContain("Jedes Experiment");
    expect(text).toContain("\\344");
    expect(text).toContain("\\374");
  });
});
