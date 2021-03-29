import Login from './components/Login'
import TicketsList from './components/solicitudComponents/TicketsList'
import TicketsCard from './components/solicitudComponents/TicketCard'
import EnviarSolicitud from './components/solicitudComponents/enviarSolicitud'
function App() {
    return (localStorage.getItem("TAToken")) ?
      <EnviarSolicitud admin ={(localStorage.getItem("TAAdmin")) === "true"} />:
      <Login /> 
}

export default App;
// 