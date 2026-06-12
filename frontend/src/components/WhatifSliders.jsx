export default function WhatifSliders({ adjustments, setAdjustments }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        What-If 
      </h3>

      <p className="text-sm text-gray-500 mb-5">
        Test realistic profile improvements and see how your admission chance changes.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Improve GPA: +{adjustments.gpaBoost}
          </label>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={adjustments.gpaBoost}
            onChange={(e) =>
              setAdjustments({
                ...adjustments,
                gpaBoost: Number(e.target.value),
              })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Add Internships
          </label>

          <select
            value={adjustments.internshipBoost}
            onChange={(e) =>
              setAdjustments({
                ...adjustments,
                internshipBoost: Number(e.target.value),
              })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value={0}>No extra internship</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Add Projects
          </label>

          <select
            value={adjustments.projectBoost}
            onChange={(e) =>
              setAdjustments({
                ...adjustments,
                projectBoost: Number(e.target.value),
              })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value={0}>No extra project</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
      </div>
    </div>
  );
}