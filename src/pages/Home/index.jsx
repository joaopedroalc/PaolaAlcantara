import React, { useState, useEffect, useContext } from "react";
import firebaseDb from "../../config/firebase.js";
import { Link } from "react-router-dom";
import "./styles.css";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

import WatchLaterIcon from "@mui/icons-material/WatchLater";

import Tooltip from "@mui/material/Tooltip";

const Home = () => {
  const [data, setData] = useState({});

  const { infosUser } = useContext(UserContext);

  useEffect(() => {
    firebaseDb.child("clientes").on("value", (snapshot) => {
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

  const onDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir ?")) {
      firebaseDb.child(`clientes/${id}`).remove((err) => {
        if (err) {
          console.log(err);
        } else {
          toast.success("Colaborador deletado com sucesso");
        }
      });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className='home'>
      <div className='sectionRegisterContainer'>
        <div className='sectionRegister'>
          <h2>Gerenciamento de clientes</h2>
          <Link to={`/add`}>
            <button className='registrarColaborador'>Agendar consulta</button>
          </Link>
        </div>
        <input
          type='search'
          placeholder='Buscar por Cliente ou Data da Consulta'
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
                data[id].nomeCliente
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return data[id];
              } else if (
                data[id].dataConsulta
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
                    {data[id].nomeCliente} |{" "}
                    {data[id].dataConsulta.toString().slice(8, 10)}
                    {"/"}
                    {data[id].dataConsulta.toString().slice(5, 7)}
                    {"/"}
                    {data[id].dataConsulta.toString().slice(0, 4)}
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
                        <Link to={`/update/${id}`}>
                          <button className='btn btn-edit'>Editar</button>
                        </Link>
                        <button
                          className='btn btn-delete'
                          onClick={() => onDelete(id)}
                        >
                          Deletar
                        </button>
                      </>

                      <Link to={`/view/${id}`}>
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

export default Home;
