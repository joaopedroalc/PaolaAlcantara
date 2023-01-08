import React, { useState, useEffect, useContext } from "react";
import firebaseDb from "../../config/firebase.js";
import { Link, useParams } from "react-router-dom";
import "./styles.css";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext.js";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import Tooltip from "@mui/material/Tooltip";

const HomeConsultas = () => {
  const [data, setData] = useState({});

  const { infosUser } = useContext(UserContext);

  let currentId = useParams();
  const { id } = currentId;

  let currentIdConsultas = useParams();
  const { idconsultas } = currentIdConsultas;

  useEffect(() => {
    firebaseDb.child(`/clientes/${id}/consultas`).on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({
          ...snapshot.val(),
        });
      } else {
        setData({});
      }
    });

    return () => {
      setData({});
    };
  }, []);

  const onDelete = (idconsultas) => {
    if (window.confirm("Tem certeza que deseja excluir ?")) {
      firebaseDb
        .child(`/clientes/${id}/consultas/${idconsultas}`)
        .remove((err) => {
          if (err) {
            console.log(err);
          } else {
            toast.success("Consulta deletada com sucesso");
          }
        });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  console.log(data);

  return (
    <div className='home'>
      <div className='sectionRegisterContainer'>
        <div className='sectionRegister'>
          <h2>Gerenciamento de clientes</h2>
          <Link to={`/consultas/${id}`}>
            <button className='registrarColaborador'>Agendar consulta</button>
          </Link>
        </div>
        <input
          type='search'
          placeholder='Buscar por Data da Consulta'
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
      </div>

      <table className='styled-table'>
        <tbody>
          {Object.keys(data)
            .filter((id) => {
              if (searchTerm == "") {
                return data[id];
              } else if (
                data[id].dataConsulta
                  .split("-")
                  .reverse()
                  .join("/")
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return data[id];
              }
            })
            .map((id, index) => {
              return (
                <tr key={id}>
                  <td>
                    {data[id].dataConsulta}
                    {" | "} {data[id].procedimento}
                  </td>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      {data[id].statusExecucao === "Executada" && (
                        <>
                          <Tooltip title='Retirada'>
                            <AssignmentTurnedInIcon color='success' />
                          </Tooltip>
                        </>
                      )}
                      {data[id].statusExecucao === "Em Acompanhamento" && (
                        <>
                          <Tooltip title='Acompanhamento'>
                            <HourglassBottomIcon color='primary' />
                          </Tooltip>
                        </>
                      )}

                      {data[id].statusExecucao === "Não Executada" && (
                        <>
                          <Tooltip title='Pendente'>
                            <PendingActionsIcon color='warning' />
                          </Tooltip>
                        </>
                      )}
                    </div>

                    <td className='buttonsAction'>
                      <>
                        <Link to={`/updateconsultas/${id}`}>
                          <button className='btn btn-edit'>Editar</button>
                        </Link>

                        <button
                          className='btn btn-delete'
                          onClick={() => onDelete(id)}
                        >
                          Deletar
                        </button>
                      </>

                      <Link to={`/viewconsultas/${id}`}>
                        <button className='btn btn-view'>
                          Visualizar tudo
                        </button>
                      </Link>
                    </td>
                  </div>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default HomeConsultas;
