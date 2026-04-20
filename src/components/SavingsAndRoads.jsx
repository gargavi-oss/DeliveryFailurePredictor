export default function SavingsAndRoads({ stops, beforeRoute }) {
  if (!stops || stops.length === 0) return null;

  const hasBefore = beforeRoute && beforeRoute.length > 0;

  const riskWeight = {
    HIGH: 500,
    MEDIUM: 200,
    LOW: 50
  };

  const beforeCost = hasBefore
    ? beforeRoute.reduce((sum, s) => sum + (riskWeight[s.risk] || 0), 0)
    : 0;

  const afterCost = stops.reduce((sum, s) => sum + (riskWeight[s.risk] || 0), 0);

  const moneySaved = hasBefore ? Math.max(beforeCost - afterCost, 0) : 0;

  const avgTraffic =
    stops.reduce((acc, curr) => acc + (curr.traffic_index || 0.5), 0) /
    stops.length;

  const isCongested = avgTraffic > 0.7;
  const roadCondition = isCongested ? "Thin & Congested" : "Broad & Clear";
  const expectedSpeed = isCongested ? "15-25 km/h" : "40-55 km/h";

  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-xs font-semibold">💰 Optimization Impact</h3>

      <div className="p-2 flex justify-between">
        <span>Money Saved</span>
        <span className="font-bold text-green-500">₹{moneySaved}</span>
      </div>

      {hasBefore && (
        <p className="text-xs text-gray-400">
          Cost reduced from ₹{beforeCost} → ₹{afterCost}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p>Road</p>
          <p>{roadCondition}</p>
        </div>
        <div>
          <p>Speed</p>
          <p>{expectedSpeed}</p>
        </div>
      </div>
    </div>
  );
}