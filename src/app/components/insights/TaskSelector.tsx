// "use client";

// import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

// export default function TaskSelector() {
//   return (
//     <div>
//       <FormGroup>
//         {tasks.map((task) => (
//           <FormControlLabel
//             key={task}
//             control={<Checkbox defaultChecked />}
//             label={task}
//             checked={selectedTasks.has(task)}
//             onChange={() => {
//               if (selectedTasks.has(task)) {
//                 selectedTasks.delete(task);
//               } else {
//                 selectedTasks.add(task);
//               }
//               setSelectedTasks(new Set(selectedTasks));
//             }}
//           />
//         ))}
//         <hr></hr>
//         <FormControlLabel
//           key={"form_control_deselect"}
//           control={<Checkbox />}
//           label="deselect all"
//           checked={selectedTasks.size === 0}
//           onChange={() => {
//             setSelectedTasks(new Set());
//           }}
//         />
//         <FormControlLabel
//           key={"form_control_select"}
//           control={<Checkbox />}
//           label="select all"
//           checked={selectedTasks.size === tasks.length}
//           onChange={() => {
//             setSelectedTasks(new Set(tasks));
//           }}
//         />
//       </FormGroup>
//     </div>
//   );
// }
