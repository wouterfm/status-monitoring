export function downTimeMinutes(issueDate: Date, resolvedDate: Date): number {
    const diff = resolvedDate.getTime() - issueDate.getTime();

    return Math.round(diff / (1000 * 60));
}
