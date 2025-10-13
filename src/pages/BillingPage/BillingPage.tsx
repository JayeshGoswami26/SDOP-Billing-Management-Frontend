import React from "react";
import MultiStepBillForm from "../../components/billing/MultiStepBillForm";

function BillingPage() {
  return (
    <>
      <main className="min-h-dvh bg-background text-foreground">
        <section className="mx-auto max-w-4xl px-4 py- md:py-">
          <header className="mb-8 text-center">
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Jewelry Billing Manager
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create customers and bills with a simple, guided multi-step form.
            </p>
          </header>
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-4 md:p-6">
              <MultiStepBillForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default BillingPage;
