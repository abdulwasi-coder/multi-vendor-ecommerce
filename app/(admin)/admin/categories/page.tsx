import { PageFrame } from "@/components/app-ui";
import { CategoryManager } from "@/components/admin-data";

export default function CategoriesPage() { return <PageFrame eyebrow="Administration" title="Categories" description="Organize the marketplace taxonomy and category attributes."><CategoryManager /></PageFrame>; }
