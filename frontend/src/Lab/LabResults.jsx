// import React from "react";
// import { useLab } from "../context/LabContext";

// export default function LabResults() {
//   const { tests } = useLab();

//   // ✅ only completed tests with result
//   const completedTests = tests.filter((t) => t.status === "done" && t.result);

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4">Lab Results</h2>

//       {completedTests.length === 0 ? (
//         <p className="text-muted">No lab results available.</p>
//       ) : (
//         <table className="table table-bordered">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>Test Name</th>
//               <th>Result</th>
//               <th>Medication</th>
//             </tr>
//           </thead>
//           <tbody>
//             {completedTests.map((t, index) => (
//               <tr key={t.id}>
//                 <td>{index + 1}</td>
//                 <td>{t.test_name}</td>
//                 <td>{t.result}</td>
//                 <td>{t.medicationGiven || "—"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
import React from "react";
import { useLab } from "../context/LabContext";

export default function LabResults() {
  const { tests } = useLab();

  // only completed tests
  const completedTests = tests.filter((t) => t.status === "done");

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lab Results</h2>

      {completedTests.length === 0 ? (
        <p className="text-muted">No lab results available.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Test Name</th>
              <th>Result</th>
              <th>Medication</th>
            </tr>
          </thead>
          <tbody>
            {completedTests.map((t, index) => (
              <tr key={t.id}>
                <td>{index + 1}</td>
                <td>{t.test_name}</td>
                <td>{t.result}</td>
                <td>{t.medicationGiven || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
