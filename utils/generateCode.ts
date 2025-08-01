export function generateRefferalCode(first_name: string) {
  return (
    first_name.replace(/\s_/g, "").slice(0, 3) +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}
