"use client";

import { Button, MainLayout } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { getUserMenuItems } from "@/lib/constants/user-menu";
import { LanguageToggle } from "@/ui";

export default function HomePage() {
  const router = useRouter();

  const { t } = useTranslation<"">();

  const menuItems = getUserMenuItems(router, t);
  const menus = [
    {
      id: 1,
      title: t("home:navigation.home"),
      link: "/",
    },
    {
      id: 2,
      title: t("home:navigation.about"),
      link: "https://thehamidreza.ir",
    },
    {
      id: 3,
      title: t("home:navigation.contribute"),
      link: "https://github.com/hamidrezaramzani",
    },
  ];

  const stats = [
    { value: "12h", label: t("home:metrics.hoursSaved") },
    { value: "30+", label: t("home:metrics.languages") },
    { value: "94%", label: t("home:metrics.accuracy") },
  ];

  const features = [
    {
      badge: t("home:features.diarization.badge"),
      title: t("home:features.diarization.title"),
      description: t("home:features.diarization.description"),
      accent: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    },
    {
      badge: t("home:features.summary.badge"),
      title: t("home:features.summary.title"),
      description: t("home:features.summary.description"),
      accent: "from-blue-500/20 via-blue-400/10 to-transparent",
    },
    {
      badge: t("home:features.security.badge"),
      title: t("home:features.security.title"),
      description: t("home:features.security.description"),
      accent: "from-amber-500/20 via-amber-400/10 to-transparent",
    },
  ];

  const workflow = [
    {
      title: t("home:workflow.capture.title"),
      description: t("home:workflow.capture.description"),
    },
    {
      title: t("home:workflow.identify.title"),
      description: t("home:workflow.identify.description"),
    },
    {
      title: t("home:workflow.summarize.title"),
      description: t("home:workflow.summarize.description"),
    },
  ];

  const previewMessages = t("home:preview.messages", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative flex w-full justify-center px-4 pb-16 pt-6">
        <MainLayout
          brandHref="/"
          brandLabel={t("common:title")}
          menuItems={menuItems}
          menus={menus}
          registerLabel={t("common:auth.signUp")}
          headerActions={<LanguageToggle />}
          loginLabel={t("common:auth.signIn")}
          openMenuLabel={t("common:openMainMenu")}
          headerVariant="landing"
          userMenuProps={{
            avatarAlt: t("common:avatarAlt"),
            guestLabel: t("common:guest"),
            renderGreeting: (name) => t("common:greeting", { name }),
          }}
          navigate={(path) => {
            router.push(path);
          }}
        >
          <div className="mt-6 space-y-10">
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-10 shadow-2xl shadow-blue-900/30 sm:px-10">
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_40%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent_50%)]" />
              </div>

              <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.2)]" />
                    {t("home:hero.badge")}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
                      {t("home:hero.eyebrow")}
                    </p>
                    <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                      {t("home:hero.headline")}
                    </h1>
                    <p className="max-w-2xl text-base text-slate-200 sm:text-lg">
                      {t("home:hero.subheadline")}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      fullWidth={false}
                      variant="primary"
                      className="min-w-[160px] rounded-full px-6 py-2 text-base font-semibold shadow-lg shadow-blue-500/30"
                    >
                      {t("home:hero.primaryCta")}
                    </Button>
                    <Button
                      fullWidth={false}
                      variant="secondary"
                      className="min-w-[160px] rounded-full border border-white/20 bg-white/10 px-6 py-2 text-base font-semibold text-white backdrop-blur hover:bg-white/20"
                    >
                      {t("home:hero.secondaryCta")}
                    </Button>
                    <span className="text-sm text-slate-300">
                      {t("home:hero.pill")}
                    </span>
                  </div>

                  <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:grid-cols-3">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-col rounded-xl bg-white/5 px-4 py-3 shadow-inner shadow-slate-900/40"
                      >
                        <span className="text-2xl font-black text-white">
                          {stat.value}
                        </span>
                        <span className="text-sm text-slate-300">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-blue-500/10 via-emerald-400/10 to-indigo-500/10 blur-3xl" />
                  <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-900/40 backdrop-blur">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-lg">
                          🎙️
                        </span>
                        <div>
                          <p className="text-sm text-slate-300">
                            {t("home:preview.title")}
                          </p>
                          <p className="text-base font-semibold text-white">
                            {t("home:preview.subtitle")}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                        {t("home:preview.label")}
                      </span>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                      {previewMessages?.map((message, idx) => (
                        <div
                          key={message}
                          className="flex items-start gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-100"
                        >
                          <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-200">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed">{message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-900/30 backdrop-blur"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.accent}`}
                  />
                  <div className="relative space-y-3">
                    <span className="inline-flex rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                      {feature.badge}
                    </span>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-900/30 backdrop-blur lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">
                  {t("home:workflow.eyebrow")}
                </p>
                <h2 className="text-2xl font-black text-white sm:text-3xl">
                  {t("home:workflow.title")}
                </h2>
                <p className="text-sm text-slate-200 sm:text-base">
                  {t("home:workflow.subtitle")}
                </p>
                <div className="space-y-4">
                  {workflow.map((step, index) => (
                    <div
                      key={step.title}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-base font-bold text-blue-100">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-200">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-slate-900 p-6 shadow-lg shadow-blue-900/40">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.25em] text-blue-100">
                    {t("home:cta.eyebrow")}
                  </p>
                  <h3 className="text-2xl font-black leading-snug text-white">
                    {t("home:cta.title")}
                  </h3>
                  <p className="text-sm text-blue-50">
                    {t("home:cta.subtitle")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    fullWidth={false}
                    variant="primary"
                    className="min-w-[180px] rounded-full px-6 py-2 text-base font-semibold shadow-xl shadow-blue-500/30"
                  >
                    {t("home:cta.primaryCta")}
                  </Button>
                  <Button
                    fullWidth={false}
                    variant="secondary"
                    className="min-w-[160px] rounded-full border border-white/30 bg-white/15 px-5 py-2 text-base font-semibold text-white hover:bg-white/25"
                  >
                    {t("home:cta.secondaryCta")}
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </MainLayout>
      </div>
    </div>
  );
}
