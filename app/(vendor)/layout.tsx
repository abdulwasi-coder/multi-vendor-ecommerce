import { WorkspaceShell } from "@/components/workspace-shell";

export default function VendorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <WorkspaceShell kind="vendor">{children}</WorkspaceShell>;
}
