export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background overflow-hidden">
      {children}
    </div>
  );
}
