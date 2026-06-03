export default function CollegeCard({ college }) {
  return (
    <article className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-900">
        {college.name}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {college.state}
      </p>

      <p className="mt-4 text-gray-700">
        <span className="font-semibold">Tuition:</span> ₹{college.tuition}
      </p>

      <div className="mt-4 border-t pt-4">
        <p className="text-sm font-semibold text-gray-900">
          Why This Tier?
        </p>

        <p className="text-sm text-gray-600 mt-1">
          Based on your selected budget and location filters.
        </p>
      </div>
    </article>
  );
}