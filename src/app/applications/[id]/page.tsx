import { ApplicationDetailView } from "@/components/applications/ApplicationDetailView";

type PageProps = { params: { id: string } };

export default function ApplicationDetailPage({ params }: PageProps) {
  return <ApplicationDetailView id={params.id} />;
}
