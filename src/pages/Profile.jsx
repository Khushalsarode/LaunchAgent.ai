export default function Profile() {
  return (
    <div className="p-6 bg-zinc-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <p>This is a protected Profile page. Only logged-in users can see this.</p>
    </div>
  );
}