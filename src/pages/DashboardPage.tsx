export default function DashboardPage() {
  return (
    <div className="p-8 h-full overflow-auto bg-[#0A0A0A]">
      <h1 className="text-2xl font-black mb-1">Overview</h1>
      <p className="text-gray-500 text-sm mb-8">Your NanoStudio workspace</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Active Projects</p>
          <p className="text-4xl font-black text-[#D4A017]">—</p>
        </div>
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Pending Review</p>
          <p className="text-4xl font-black text-yellow-400">—</p>
        </div>
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Sites Shipped</p>
          <p className="text-4xl font-black text-green-400">—</p>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6">
        <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-400">Getting Started</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Head to the <strong className="text-[#D4A017]">Cockpit</strong> to create your first project and start generating website content with AI.
        </p>
        <ol className="space-y-2 text-sm text-gray-400">
          <li className="flex gap-3"><span className="text-[#D4A017] font-bold">1.</span> Create a project for your client</li>
          <li className="flex gap-3"><span className="text-[#D4A017] font-bold">2.</span> Add a task — pick "site_brief" or "copywriting"</li>
          <li className="flex gap-3"><span className="text-[#D4A017] font-bold">3.</span> Run with Claude to generate the content</li>
          <li className="flex gap-3"><span className="text-[#D4A017] font-bold">4.</span> Review in the Approval Gate — approve or request changes</li>
        </ol>
      </div>
    </div>
  )
}
