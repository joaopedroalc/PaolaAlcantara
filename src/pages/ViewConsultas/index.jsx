/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import firebaseDb from "../../config/firebase.js";
import { useParams, Link, useHistory } from "react-router-dom";
import "./styles.css";

import { PDFExport } from "@progress/kendo-react-pdf";
import { useRef } from "react";
import { Button } from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";

const View = () => {
  const [data, setData] = useState({});

  let currentId = useParams();
  const { id } = currentId;

  const history = useHistory();
  useEffect(() => {
    firebaseDb.child(`clientes/${id}/consultas`).on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({
          ...snapshot.val(),
        });
      } else {
        snapshot({});
      }
    });
  }, [id]);

  const pdfExportComponentAcao = useRef(null);
  const pdfExportComponentRotina = useRef(null);
  const pdfExportComponentNovasAcoes = useRef(null);

  const exportPDFWithComponentAcao = () => {
    if (pdfExportComponentAcao.current) {
      pdfExportComponentAcao.current.save();
    }
  };

  const exportPDFWithComponentRotina = () => {
    if (pdfExportComponentRotina.current) {
      pdfExportComponentRotina.current.save();
    }
  };

  const exportPDFWithComponentNovasAcoes = () => {
    if (pdfExportComponentNovasAcoes.current) {
      pdfExportComponentNovasAcoes.current.save();
    }
  };

  console.log(data);

  return (
    <div className='container mt-5'>
      {Object.keys(data).map((userId) => {
        if (userId === id) {
          return (
            <div key={userId} className='view'>
              <div className='col-2'>
                <div className='card'>
                  <div className='card-header'>
                    <h2>Detalhes da consulta</h2>
                  </div>

                  <div className='container-colaborador'>
                    <PDFExport
                      ref={pdfExportComponentAcao}
                      paperSize='auto'
                      margin={40}
                      fileName={`Consulta do Cliente - ${data[id].dataConsulta}`}
                      author='joaopedrocode'
                    >
                      <div className='container-items'>
                        {/* {
                    Object.keys(data[id]).map((item) => {
                      return <div>
                        <h3>{item.toUpperCase()}: </h3>
                        <span>{data[id][item].toString()}</span>
                      </div>
                    })
                  } */}

                        <div className='dadosConsulta'>
                          <h2>Dados da consulta</h2>
                          <div className='colThree'>
                            <div>
                              <div>
                                <h3>Procedimento realizado </h3>
                                <p>{data[id].procedimento}</p>

                                <div>
                                  <h3>Status de Execução</h3>
                                  <p>{data[id].statusExecucao}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div>
                                <h3>Data da consulta</h3>
                                <p>
                                  {data[id].dataConsulta
                                    ?.split("-")
                                    .reverse()
                                    .join("/")}
                                </p>
                              </div>
                            </div>
                            <div>
                              <div>
                                <h3>Horário de Início</h3>
                                <p>{data[id].horaInicio}</p>
                                <h3>Horário de Término</h3>
                                <p>{data[id].horaFim}</p>
                              </div>
                            </div>
                          </div>

                          <br />

                          <div>
                            <h3>Situação do Cliente</h3>
                            <p>{data[id].situacaoCliente}</p>
                          </div>
                          <br />
                          <div className='imagensContainer'>
                            <div>
                              <h3>Imagem antes do Serviço</h3>
                              <br />
                              <img
                                src={data[id].imagemAntes}
                                className='imagemView'
                              />
                            </div>

                            <div>
                              <h3>Imagem depois do Serviço</h3>
                              <br />
                              <img
                                src={data[id].imagemDepois}
                                className='imagemView'
                              />
                            </div>
                          </div>
                        </div>

                        <div className='dadosConsulta'>
                          <h2>Histórico Patológico</h2>

                          <div>
                            <h3>Alergia</h3>
                            <p>
                              {data[id].alergia === "Sim"
                                ? data[id].tipoAlergia
                                : "Não"}
                            </p>
                          </div>

                          <div>
                            <h3>Tratamento médico</h3>
                            <p>
                              {data[id].medicacao === "Sim"
                                ? data[id].tipoMedicamento
                                : "Não"}
                            </p>
                          </div>

                          <div>
                            <h3>Comorbidades</h3>
                            {data[id].comorbidades?.map((doenca) => {
                              return <p>{doenca}</p>;
                            })}
                          </div>
                        </div>
                      </div>
                    </PDFExport>

                    <Button
                      onClick={exportPDFWithComponentAcao}
                      className='button-download'
                      variant='contained'
                    >
                      Imprimir dados da consulta
                      <PrintIcon />
                    </Button>
                  </div>
                </div>
              </div>

              <Link to='/'>
                <Button
                  variant='outlined'
                  style={{ display: "block", margin: "1rem auto" }}
                  onClick={() => history.push("/")}
                >
                  Voltar
                </Button>
              </Link>
            </div>
          );
        }
      })}
    </div>
  );
};

export default View;
