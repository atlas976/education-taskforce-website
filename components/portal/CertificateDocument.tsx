"use client";

import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  createCertificateContent,
  createCertificateFilename,
  createCertificatePdf,
  type CertificateLanguage,
} from "@/lib/domain/certificate";
import styles from "./CertificateDocument.module.css";

type CertificateDocumentProps = {
  participantName: string;
};

export function CertificateDocument({ participantName }: CertificateDocumentProps) {
  const [language, setLanguage] = useState<CertificateLanguage>("en");
  const content = useMemo(() => createCertificateContent({ language, participantName }), [language, participantName]);

  function handleDownload() {
    const pdf = createCertificatePdf({ language, participantName });
    const pdfBuffer =
      pdf.buffer instanceof ArrayBuffer
        ? pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength)
        : new Uint8Array(pdf).buffer;
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = createCertificateFilename(participantName, language);
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.shell}>
      <div className={styles.actions}>
        <div className={styles.languageToggle} aria-label="Certificate language">
          <button
            aria-pressed={language === "en"}
            className={language === "en" ? styles.active : ""}
            onClick={() => setLanguage("en")}
            type="button"
          >
            English
          </button>
          <button
            aria-pressed={language === "de"}
            className={language === "de" ? styles.active : ""}
            onClick={() => setLanguage("de")}
            type="button"
          >
            Deutsch
          </button>
        </div>
        <Button icon={<Download aria-hidden="true" size={18} />} onClick={handleDownload} type="button">
          Download PDF
        </Button>
      </div>
      <article className={styles.certificate} aria-label={`Certificate for ${participantName}`}>
        <div className={styles.brand}>TUM.ai</div>
        <p className={styles.kicker}>{content.subtitle}</p>
        <h1>{content.participantName}</h1>
        <p className={styles.statement}>{content.statement}</p>
        <p className={styles.description}>{content.description}</p>
        <div className={styles.footer}>
          <div>
            <strong>{content.courseName}</strong>
            <span>{content.footerLeft}</span>
          </div>
          <div>
            <strong>{content.organizerName}</strong>
            <span>{content.footerRight}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
