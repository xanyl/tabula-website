"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = (formData.get("company") as string) || null;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

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
