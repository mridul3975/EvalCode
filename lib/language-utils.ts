import { QuestionItem, QuestionLanguage } from "@/types/question";

/**
 * Returns the AI-generated code for the specified language.
 * Falls back to the default (python) code if no variant exists.
 */
export function getCodeForLanguage(
  question: QuestionItem,
  lang: QuestionLanguage
): string {
  if (lang === question.language) {
    return question.ai_response.code;
  }
  return question.language_variants?.[lang]?.code ?? question.ai_response.code;
}

/**
 * Returns the corrected code for the specified language.
 * Falls back to the default (python) corrected code if no variant exists.
 */
export function getCorrectedCodeForLanguage(
  question: QuestionItem,
  lang: QuestionLanguage
): string {
  if (lang === question.language) {
    return question.ground_truth.corrected_code;
  }
  return (
    question.language_variants?.[lang]?.corrected_code ??
    question.ground_truth.corrected_code
  );
}

/**
 * Returns the list of languages available for a question.
 * Always includes the default language first.
 */
export function getAvailableLanguages(
  question: QuestionItem
): QuestionLanguage[] {
  const langs: QuestionLanguage[] = [question.language];
  if (question.language_variants) {
    for (const lang of Object.keys(question.language_variants) as QuestionLanguage[]) {
      if (lang !== question.language && question.language_variants[lang]) {
        langs.push(lang);
      }
    }
  }
  return langs;
}

/** Human-readable label for a language key */
export function getLanguageLabel(lang: QuestionLanguage): string {
  const labels: Record<QuestionLanguage, string> = {
    python: "Python",
    javascript: "JavaScript",
    cpp: "C++",
    java: "Java",
    sql: "SQL",
  };
  return labels[lang] || lang;
}
