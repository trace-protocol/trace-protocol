export async function sendEmail({ to, subject, body }) {
  await new Promise(r => setTimeout(r, 200));
  // throw new Error("SMTP rejected"); // test failure
  return { id: "msg_" + Math.random().toString(36).slice(2, 8), to, subject };
}