export default async function ClinicPage({
  params,
}: {
  params: Promise<{ clinicId: string }>;
}) {
  const { clinicId } = await params;

  return (
    <div className="bg-red-500 text-white min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Clinic ID: {clinicId}</h1>
    </div>
  );
}