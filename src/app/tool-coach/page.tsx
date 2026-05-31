import dynamic from "next/dynamic";

function ToolCoachLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" role="status">
      <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" aria-hidden="true" />
    </div>
  );
}

const ToolCoachPageClient = dynamic(
  () => import("@/components/tool-coach/ToolCoachPageClient"),
  { loading: () => <ToolCoachLoading /> },
);

export default function ToolCoachPage() {
  return <ToolCoachPageClient />;
}
