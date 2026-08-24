/**
 * Capsules unlock on a fixed timezone (Pacific Time) rather than the
 * viewer's or the server's own timezone, so "unlock day" means the same
 * calendar day for every user, no matter where they are or where the
 * cron job that checks this happens to run.
 *
 * "America/Los_Angeles" is used instead of a hardcoded UTC-8 offset so
 * this automatically accounts for the PST/PDT switch across the year.
 */
export function todayInPacificTime(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
}

export function isUnlocked(unlockDate: string): boolean {
  return unlockDate <= todayInPacificTime();
}
