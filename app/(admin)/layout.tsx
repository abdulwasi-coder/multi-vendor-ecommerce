import { WorkspaceShell } from "@/components/workspace-shell";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <WorkspaceShell kind="admin">{children}</WorkspaceShell>;
}
