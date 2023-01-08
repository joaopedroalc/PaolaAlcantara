import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./styles.css";
import firebaseDb from "../../config/firebase.js";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import InputMask from "react-input-mask";

import { UserContext } from "../../context/UserContext";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Cardíaca",
  "Vasculares",
  "Reumática",
  "Renal",
  "DIU",
  "Glandulares",
  "Bronquite",
  "Resfriados",
  "Contraceptivos",
  "DSTS",
];

const AddEdit = () => {
  const { infosUser } = useContext(UserContext);

  // console.log(infosUser);

  const initialState = {
    nomeCliente: "",
  };

  const [state, setState] = useState(initialState);
  const [data, setData] = useState({});
  const {
    nomeCliente,
    telefone,
    procedimento,
    dataConsulta,
    horaInicio,
    horaFim,
    statusExecucao,
    situacaoCliente,
    imagemAntes,
    imagemDepois,

    //historico patologico
    alergia,
    tipoAlergia,
    medicacao,
    tipoMedicamento,
  } = state;

  const history = useHistory();

  const { id } = useParams();
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
  }, [id]);

  useEffect(() => {
    if (id) {
      setState({ ...data[id] });
    } else {
      setState({ ...initialState });
    }
    return () => {
      setState({ ...initialState });
    };
  }, [id, data]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    // console.log(e.target.value);
    //PEGAR OS LABELS PORÉM NOME DE CHAVE TEM QUE SER JUNTO NO JS
    setState({
      ...state,
      [name]: value,
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleCaptureValueImage = async (e) => {
    let { name } = e.target;

    const base64 = await convertToBase64(e.target.files[0]);
    // console.log(e.target.files[0]);

    setState({
      ...state,
      [name]: base64,
    });
  };

  // const handleInputChangeCheckbox = (e) => {
  //   let { name, checked } = e.target;
  //   console.log({ name, checked })
  //   setState({
  //     ...state,
  //     [name]: checked,
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nomeCliente) {
      toast.error("Forneça um valor no campo nome");
    } else {
      if (!id) {
        // No id mean user is adding record for the first time
        firebaseDb.child("clientes").push(state, (err) => {
          if (err) {
            toast.error(err);
          } else {
            toast.success("Cliente adicionado com sucesso");
          }
        });
      } else {
        firebaseDb.child(`/clientes/${id}`).set(state, (err) => {
          if (err) {
            toast.error(err);
          } else {
            toast.success("Cliente atualizado com sucesso");
          }
        });
      }
      setTimeout(() => history.push("/"), 500);
    }
  };

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    setState({
      ...state,
      ["comorbidades"]: event.target.value,
    });
  };

  console.log(personName);
  console.log(state);

  return (
    <div className='add-edit'>
      <form className='add-edit__form' onSubmit={handleSubmit}>
        <section className='containerForms'>
          <div className='infosObraForm'>
            <h2>Cadastrar informações</h2>
            <label htmlFor='nomeCliente'>Nome do Cliente</label>
            <input
              type='text'
              required
              id='nomeCliente'
              name='nomeCliente'
              value={nomeCliente}
              onChange={handleInputChange}
            />

            <label htmlFor='telefone'>Telefone</label>

            <InputMask
              id='telefone'
              name='telefone'
              required
              mask='99 99999-9999'
              value={telefone}
              onChange={handleInputChange}
            />

            <label htmlFor='procedimento'>Procedimento realizado</label>
            <input
              type='text'
              id='procedimento'
              name='procedimento'
              required
              value={procedimento}
              onChange={handleInputChange}
            />

            <label htmlFor='imagemAntes'>Imagem Antes do Serviço</label>
            <input
              type='file'
              id='imagemAntes'
              name='imagemAntes'
              onChange={handleCaptureValueImage}
            />
            {imagemAntes && <img src={imagemAntes} className='imagemPreview' />}
            <br />
            <label htmlFor='imagemDepois'>Imagem Depois do Serviço</label>
            <input
              type='file'
              id='imagemDepois'
              name='imagemDepois'
              onChange={handleCaptureValueImage}
            />
            {imagemDepois && (
              <img src={imagemDepois} className='imagemPreview' />
            )}
            <br />

            <Button onClick={handleClickOpen("paper")} variant='contained'>
              Dados de Histórico Patológico
            </Button>

            <Dialog
              open={open}
              onClose={handleClose}
              scroll={scroll}
              aria-labelledby='scroll-dialog-title'
              aria-describedby='scroll-dialog-description'
            >
              <DialogTitle id='scroll-dialog-title'>
                Dados de Histórico Patológico
              </DialogTitle>
              <DialogContent dividers={scroll === "paper"}>
                <label htmlFor='alergia' className='label-dialog'>
                  Possui Alergia
                </label>
                <select
                  name='alergia'
                  id='alergia'
                  value={alergia}
                  onChange={handleInputChange}
                >
                  <option value='' style={{ display: "none" }}></option>
                  <option value='Sim'>Sim</option>
                  <option value='Não'>Não</option>
                </select>

                {alergia === "Sim" ? (
                  <input
                    type='text'
                    id='tipoAlergia'
                    name='tipoAlergia'
                    placeholder='Qual Alergia'
                    required
                    value={tipoAlergia}
                    onChange={handleInputChange}
                  />
                ) : (
                  ""
                )}

                <label htmlFor='medicacao' className='label-dialog'>
                  Tratamento médico/medicação
                </label>
                <select
                  name='medicacao'
                  id='medicacao'
                  value={medicacao}
                  onChange={handleInputChange}
                >
                  <option value='' style={{ display: "none" }}></option>
                  <option value='Sim'>Sim</option>
                  <option value='Não'>Não</option>
                </select>

                {medicacao === "Sim" ? (
                  <input
                    type='text'
                    id='tipoMedicamento'
                    name='tipoMedicamento'
                    placeholder='Qual Medicamento'
                    required
                    value={tipoMedicamento}
                    onChange={handleInputChange}
                  />
                ) : (
                  ""
                )}

                <FormControl sx={{ mt: 2, width: "100%" }}>
                  <InputLabel id='demo-multiple-checkbox-label'>
                    Comorbidades
                  </InputLabel>
                  <Select
                    labelId='demo-multiple-checkbox-label'
                    id='demo-multiple-checkbox'
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label='Comorbidades' />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {names.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={personName.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleClose} variant='contained'>
                  Salvar
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          <div className='situacaoObraForm'>
            <h2>Informações da consulta</h2>

            <label htmlFor='situacaoCliente'>Situação do Cliente</label>
            <textarea
              name='situacaoCliente'
              id='situacaoCliente'
              rows={12}
              spellCheck={true}
              style={{ resize: "none" }}
              value={situacaoCliente}
              onChange={handleInputChange}
            ></textarea>

            <label htmlFor='statusExecucao'>Status da consulta</label>
            <select
              name='statusExecucao'
              id='statusExecucao'
              value={statusExecucao}
              onChange={handleInputChange}
            >
              <option value=''>Nenhum</option>
              <option value='Executada'>Executada</option>
              <option value='Em Acompanhamento'>Em Acompanhamento</option>
              <option value='Não Executada'>Não Executada</option>
            </select>

            <div className='containerInfosConsulta'>
              <div>
                <label htmlFor='dataConsulta'>Data da consulta</label>

                <input
                  type='date'
                  id='dataConsulta'
                  required
                  value={dataConsulta}
                  onChange={handleInputChange}
                  name='dataConsulta'
                />
              </div>

              <div>
                <label htmlFor='horaInicio'>Horário de Início</label>
                <input
                  type='time'
                  id='horaInicio'
                  name='horaInicio'
                  value={horaInicio || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor='horaFim'>Horário de Término</label>
                <input
                  type='time'
                  id='horaFim'
                  name='horaFim'
                  value={horaFim || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </section>

        <input type='submit' value={id ? "Atualizar" : "Cadastrar"} />
      </form>
    </div>
  );
};

export default AddEdit;
