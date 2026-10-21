import { getTransactionDashboardDataV2 } from "../actions/transactions";

export default async function TestPage() {
  let dashboardData = null;
  let error = null;

  try {
    dashboardData = await getTransactionDashboardDataV2();
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-4 text-2xl font-bold">
        หน้าทดสอบ Server Action (Debug Page)
      </h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
          เกิดข้อผิดพลาด:{error}
        </div>
      )}

      <div className="rounded bg-gray-100 p-4 shadow">
        <h2 className="mb-2 text-lg font-medium">
          ผลลัพธ์ข้อมูลจาก Dashboard:
        </h2>
        <pre className="roudned max-h-96 overflow-auto bg-black p-4 text-sm text-green-400">
          {JSON.stringify(dashboardData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
