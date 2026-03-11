"use client";

import { useState } from "react";
import CollectionPanel from "@/components/CollectionPanel";
import FeaturePanel from "@/components/FeaturePanel";
import Hero from "@/components/Hero";
import InsightPanel from "@/components/InsightPanel";
import ReferenceShelf from "@/components/ReferenceShelf";
import StatePanel from "@/components/StatePanel";
import StatsStrip from "@/components/StatsStrip";
import WorkspacePanel from "@/components/WorkspacePanel";
import { createInsights, createPlan } from "@/lib/api";

const APP_NAME = "RunwayLedger";
const TAGLINE = "Visualize every dollar as a point on your runway \u2013 the interactive cash\u2011flow atlas for founders and freelancers.";
const FEATURE_CHIPS = ["Interactive Runway Atlas - A full\u2011width, cartographic map that draws the runway line, reserve bucket bands, scenario nodes and risk flags in real time.", "Live Income/Expense Pinning - Drag\u2011and\u2011drop pins for recurring or one\u2011off cash\u2011flows onto the timeline; each pin instantly re\u2011calculates runway length and updates the map.", "Reserve Bucket Builder & Drag\u2011Resize - Visual pastel bands represent operating, growth, safety reserves; users resize them with handles, instantly shifting runway projection.", "Scenario Route Planner - Branching nodes let founders plot alternative futures (e.g., funding raise, cost cut). Arrow paths morph smoothly when a scenario is activated."];
const PROOF_POINTS = ["Open\u2011source GitHub repo: 150+ stars, 30+ contributors, CI badge", "Founder case\u2011study carousel featuring three early\u2011stage startups that cut reporting time by 80%", "Performance benchmark: full map redraw <\u202f100\u202fms on a typical laptop", "Validated algorithm sheet confirming deterministic outputs for every scenario"];
const SURFACE_LABELS = {"hero": "cartographic runway map with routes, buckets and checkpoint flags", "workspace": "Runway Atlas Overview \u2013 full\u2011width interactive map with runway line, bucket bands and scenario nodes", "result": "Income & Expense Pin Input \u2013 a floating button + minimal modal for quick cash\u2011flow entry", "support": "Open\u2011source repository badge with contribution stats", "collection": "Legend Panel \u2013 top\u2011right map key with icon definitions and live status"};
const PLACEHOLDERS = {"query": "Enter income / expense", "preferences": "Adjust buckets & scenarios"};
const DEFAULT_STATS = [{"label": "RunwayMapSnapshot", "value": "7"}, {"label": "Open\u2011source repository badge with contribution stats", "value": "0"}, {"label": "Readiness score", "value": "88"}];
const READY_TITLE = "User drops a $5\u202fk unexpected expense pin \u2192 runway line contracts, the nearest checkpoint flashes red, and the legend auto\u2011highlights \u201cRisk!\u201d";
const READY_DETAIL = "In a live demo, the presenter adds an unexpected $5k expense; the runway line contracts, the risk checkpoint flashes red, and then switches to an alternate \u201craise funding\u201d scenario that reroutes the map, instantly showing a recovered runway. / User drops a $5\u202fk unexpected expense pin \u2192 runway line contracts, the nearest checkpoint flashes red, and the legend auto\u2011highlights \u201cRisk!\u201d / Switching to a \u201cseed raise\u201d scenario node instantly reroutes the runway line, extending it by the projected capital and recoloring buckets in real\u2011time";
const COLLECTION_TITLE = "Cartographic Runway Map With Routes, Buckets And Checkpoint Flags stays visible after each run.";
const SUPPORT_TITLE = "Open\u2011Source Repository Badge With Contribution Stats";
const REFERENCE_TITLE = "Scenario Builder Rail \u2013 Bottom Rail Showing Saved Scenario Nodes That Can Be Toggled";
const BUTTON_LABEL = "Add Cash\u2011Flow Pin";
type LayoutKind = "storyboard" | "operations_console" | "studio" | "atlas" | "notebook" | "lab";
const LAYOUT: LayoutKind = "atlas";
const UI_COPY_TONE = "Clear, cartographer\u2011style guidance";
const SAMPLE_ITEMS = ["{'type': 'recurring_income', 'name': 'Client retainer', 'amount': 8000, 'frequency': 'monthly'}", "{'type': 'recurring_expense', 'name': 'Office & SaaS', 'amount': 3500, 'frequency': 'monthly'}", "{'type': 'reserve_bucket', 'name': 'Operating Reserve', 'amount': 15000, 'color': 'pastel\u2011green'}", "{'type': 'reserve_bucket', 'name': 'Growth Reserve', 'amount': 10000, 'color': 'pastel\u2011blue'}"];
const REFERENCE_OBJECTS = ["runway line", "reserve bucket segment", "scenario node", "risk checkpoint flag", "legend panel"];

type PlanItem = { title: string; detail: string; score: number };
type InsightPayload = { insights: string[]; next_actions: string[]; highlights: string[] };
type PlanPayload = { summary: string; score: number; items: PlanItem[]; insights?: InsightPayload };

export default function Page() {
  const [query, setQuery] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PlanPayload | null>(null);
  const [saved, setSaved] = useState<PlanPayload[]>([]);
  const layoutClass = LAYOUT.replace(/_/g, "-");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const nextPlan = await createPlan({ query, preferences });
      const insightPayload = await createInsights({
        selection: nextPlan.items?.[0]?.title ?? query,
        context: preferences || query,
      });
      const composed = { ...nextPlan, insights: insightPayload };
      setPlan(composed);
      setSaved((previous) => [composed, ...previous].slice(0, 4));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const stats = DEFAULT_STATS.map((stat, index) => {
    if (index === 0) return { ...stat, value: String(FEATURE_CHIPS.length) };
    if (index === 1) return { ...stat, value: String(saved.length) };
    if (index === 2) return { ...stat, value: plan ? String(plan.score) : stat.value };
    return stat;
  });

  const heroNode = (
    <Hero
      appName={APP_NAME}
      tagline={TAGLINE}
      proofPoints={PROOF_POINTS}
      eyebrow={SURFACE_LABELS.hero}
    />
  );
  const statsNode = <StatsStrip stats={stats} />;
  const workspaceNode = (
    <WorkspacePanel
      query={query}
      preferences={preferences}
      onQueryChange={setQuery}
      onPreferencesChange={setPreferences}
      onGenerate={handleGenerate}
      loading={loading}
      features={FEATURE_CHIPS}
      eyebrow={SURFACE_LABELS.workspace}
      queryPlaceholder={PLACEHOLDERS.query}
      preferencesPlaceholder={PLACEHOLDERS.preferences}
      actionLabel={BUTTON_LABEL}
    />
  );
  const primaryNode = error ? (
    <StatePanel eyebrow="Request blocked" title="Request blocked" tone="error" detail={error} />
  ) : plan ? (
    <InsightPanel plan={plan} eyebrow={SURFACE_LABELS.result} />
  ) : (
    <StatePanel eyebrow={SURFACE_LABELS.result} title={READY_TITLE} tone="neutral" detail={READY_DETAIL} />
  );
  const featureNode = (
    <FeaturePanel eyebrow={SURFACE_LABELS.support} title={SUPPORT_TITLE} features={FEATURE_CHIPS} proofPoints={PROOF_POINTS} />
  );
  const collectionNode = <CollectionPanel eyebrow={SURFACE_LABELS.collection} title={COLLECTION_TITLE} saved={saved} />;
  const referenceNode = (
    <ReferenceShelf
      eyebrow={SURFACE_LABELS.support}
      title={REFERENCE_TITLE}
      items={SAMPLE_ITEMS}
      objects={REFERENCE_OBJECTS}
      tone={UI_COPY_TONE}
    />
  );

  function renderLayout() {
    if (LAYOUT === "storyboard") {
      return (
        <>
          {heroNode}
          {statsNode}
          <section className="storyboard-stage">
            <div className="storyboard-main">
              {workspaceNode}
              {primaryNode}
            </div>
            <div className="storyboard-side">
              {referenceNode}
              {featureNode}
            </div>
          </section>
          {collectionNode}
        </>
      );
    }

    if (LAYOUT === "operations_console") {
      return (
        <section className="console-shell">
          <div className="console-top">
            {heroNode}
            {statsNode}
          </div>
          <div className="console-grid">
            <div className="console-operator-lane">
              {workspaceNode}
              {referenceNode}
            </div>
            <div className="console-timeline-lane">{primaryNode}</div>
            <div className="console-support-lane">
              {featureNode}
              {collectionNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "studio") {
      return (
        <section className="studio-shell">
          <div className="studio-top">
            {heroNode}
            {primaryNode}
          </div>
          {statsNode}
          <div className="studio-bottom">
            <div className="studio-left">
              {workspaceNode}
              {collectionNode}
            </div>
            <div className="studio-right">
              {referenceNode}
              {featureNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "atlas") {
      return (
        <section className="atlas-shell">
          <div className="atlas-hero-row">
            {heroNode}
            <div className="atlas-side-stack">
              {statsNode}
              {referenceNode}
            </div>
          </div>
          <div className="atlas-main-row">
            <div className="atlas-primary-stack">
              {primaryNode}
              {collectionNode}
            </div>
            <div className="atlas-secondary-stack">
              {workspaceNode}
              {featureNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "notebook") {
      return (
        <section className="notebook-shell">
          {heroNode}
          <div className="notebook-top">
            <div className="notebook-left">
              {primaryNode}
              {referenceNode}
            </div>
            <div className="notebook-right">
              {workspaceNode}
              {featureNode}
            </div>
          </div>
          <div className="notebook-bottom">
            {collectionNode}
            {statsNode}
          </div>
        </section>
      );
    }

    return (
      <>
        {heroNode}
        {statsNode}
        <section className="content-grid">
          {workspaceNode}
          <div className="stack">
            {primaryNode}
            {referenceNode}
            {featureNode}
          </div>
        </section>
        {collectionNode}
      </>
    );
  }

  return (
    <main className={`page-shell layout-${layoutClass}`}>
      {renderLayout()}
    </main>
  );
}
