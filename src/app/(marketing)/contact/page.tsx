import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="mx-auto max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent text-center font-serif">
            Start here
          </p>
          <h1 className="mt-3 text-center font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
            Start a conversation.
          </h1>
          <p className="mt-4 text-center text-text-muted">
            We start every engagement by understanding your workflows. No pitch,
            no pressure — just a conversation about what you are trying to
            improve.
          </p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
