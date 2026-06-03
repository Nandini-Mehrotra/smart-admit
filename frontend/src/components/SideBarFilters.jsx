export default function SidebarFilters({ state, setState, maxBudget, setMaxBudget }) {
  return (
    <aside className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm w-full lg:w-72 h-fit">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Filters</h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State
        </label>

        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Example: Delhi"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Budget
        </label>

        <input
          type="number"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          placeholder="Example: 500000"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </aside>
  );
}