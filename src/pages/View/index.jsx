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
    firebaseDb.child("clientes").on("value", (snapshot) => {
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
                    <h2>Dados pessoais</h2>
                  </div>
                  {console.log(data[id])}
                  <div className='container-colaborador'>
                    <PDFExport
                      ref={pdfExportComponentAcao}
                      paperSize='auto'
                      margin={40}
                      fileName={`Consulta do Cliente ${data[id].nomeCliente} - ${data[id].dataConsulta}`}
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
                        <div className='dadosPessoais'>
                          <div>
                            <h3>Nome</h3>
                            <p>{data[id].nomeCliente}</p>
                          </div>
                          <div>
                            <h3>Telefone</h3>
                            <p>{data[id].telefone}</p>
                          </div>
                        </div>
                      </div>
                    </PDFExport>

                    <Button
                      onClick={exportPDFWithComponentAcao}
                      className='button-download'
                      variant='contained'
                    >
                      Imprimir dados pessoais
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
