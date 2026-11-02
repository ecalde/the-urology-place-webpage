import { Resend } from "resend";
import {
  buildTrelloCardDescription,
  buildTrelloCardName,
  type NormalizedContact,
} from "@/app/lib/contact-submission";

type SendContactNotificationEmailArgs = {
  contact: NormalizedContact;
};

function getResendClient(): { resend: Resend; from: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.CONTACT_NOTIFICATION_FROM?.trim() ?? "";

  if (!apiKey || !from) {
    throw new Error("Resend env not configured");
  }

  return {
    resend: new Resend(apiKey),
    from,
  };
}

async function sendResendTextEmail({
  to,
  replyTo,
  subject,
  text,
}: {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}): Promise<void> {
  const { resend, from } = getResendClient();

  const result = await resend.emails.send({
    from,
    to,
    replyTo,
    subject,
    text,
  });

  if (result.error) {
    throw new Error(result.error.message || "Resend email send failed");
  }
}

function buildContactNotificationEmailText(
  contact: NormalizedContact,
): string {
  const lines = [
    "A new contact form submission was received.",
    "",
    buildTrelloCardDescription(contact),
  ];

  return lines.join("\n");
}

export async function sendContactNotificationEmail({
  contact,
}: SendContactNotificationEmailArgs): Promise<void> {
  const to = process.env.CONTACT_NOTIFICATION_TO?.trim() ?? "";

  if (!to) {
    console.error("[contact] CONTACT_NOTIFICATION_TO not configured");
    return;
  }

  const subject = `New Contact Request: ${buildTrelloCardName(contact)}`;
  const text = buildContactNotificationEmailText(contact);

  await sendResendTextEmail({
    to,
    replyTo: contact.email,
    subject,
    text,
  });
}
