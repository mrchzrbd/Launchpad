import dynamic from "next/dynamic";
import { Suspense } from "react";

function WorkspaceLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-text-muted font-body">Loading workspace…</p>
      </div>
    </div>
  );
}

const WorkspacePageClient = dynamic(
  () => import("@/components/workspace/WorkspacePageClient"),
  { loading: () => <WorkspaceLoading /> },
);

export default function WorkspacePage() {
  return (
    <Suspense fallback={<WorkspaceLoading />}>
      <WorkspacePageClient />
    </Suspense>
  );
}
