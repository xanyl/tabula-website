"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { validateContactForm } from "@/lib/validation";

export async function submitContact(formData: FormData) {
  const validationError = validateContactForm(formData);
  if (validationError) {
    return validationError;
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = (formData.get("company") as string) || null;
  const message = formData.get("message") as string;

  const session = await auth();

  try {
    await prisma.contactInquiry.create({
      data: {
        name,
        email,
        company,
        message,
        userId: session?.user?.id || null,
      },
    });

    revalidatePath("/dashboard/inquiries");
    return { success: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
