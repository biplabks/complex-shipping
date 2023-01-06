import './App.css';
import ComplexShipping from './pages/ComplexShipping';

import MyProvider from './pages/MyProvider';

// function App() {
//   return (
//     <div className="App">
//       <MyProvider>
//         <div className="App">
//           <ComplexShipping />
//         </div>
//       </MyProvider>
//     </div>
//   );
// }

function App() {
  return (
      <MyProvider>
        <div className="App">
          <ComplexShipping />
        </div>
      </MyProvider>
  );
}

export default App;
