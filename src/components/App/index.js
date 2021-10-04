import PropTypes, { any } from 'prop-types';
import React, { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import moment from 'moment';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Todo = ({ idRef, itemTodo, onRemove, onEdit, onDone }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const { id, title, description, done, time } = itemTodo;
  const { createdAt, updatedAt, doneAt } = time;
  const {
    current: { value },
  } = idRef;
  return (
    <Card sx={{ maxWidth: 430, bgcolor: done ? 'gray' : 'white' }}>
      <CardHeader
        title={done ? <s>{title}</s> : title}
        action={
          <>
            <IconButton>
              <AccessTimeIcon onClick={handleClick} />
            </IconButton>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Typography sx={{ px: 2 }}>
                <b>Criado:</b> {createdAt.format('DD/MM/YYYY hh:mm:ss')}
              </Typography>
              <Typography sx={{ px: 2 }}>
                <b>Atualizado:</b> {updatedAt.format('DD/MM/YYYY hh:mm:ss')}
              </Typography>
              <Typography sx={{ px: 2 }}>
                <b>Finalizado:</b>{' '}
                {doneAt ? doneAt.format('DD/MM/YYYY hh:mm:ss') : '-----'}
              </Typography>
            </Popover>
          </>
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {done ? <s>{description}</s> : description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          color="success"
          disabled={done || id === value}
          sx={{
            m: 1,
          }}
          variant="contained"
          onClick={() => onEdit(itemTodo)}
        >
          Editar
        </Button>
        <Button
          color="error"
          disabled={done || id === value}
          sx={{
            m: 1,
          }}
          variant="contained"
          onClick={() => onRemove(itemTodo)}
        >
          Remover
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={done}
              color="default"
              disabled={id === value}
              onChange={() => onDone(itemTodo)}
            />
          }
          label="Tarefa concluida"
        />
      </CardActions>
    </Card>
  );
};

Todo.propTypes = {
  idRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
  ]).isRequired,
  itemTodo: PropTypes.objectOf(any).isRequired,
  onDone: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const ListTodo = ({ idRef, listTodo, onRemove, onEdit, onDone }) => (
  <Stack spacing={2} sx={{ alignItems: 'center' }}>
    {listTodo.map(todo => (
      <Todo
        key={uuid()}
        idRef={idRef}
        itemTodo={todo}
        onRemove={onRemove}
        onEdit={onEdit}
        onDone={onDone}
      />
    ))}
  </Stack>
);

ListTodo.propTypes = {
  idRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
  ]).isRequired,
  listTodo: PropTypes.arrayOf(any).isRequired,
  onDone: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const App = () => {
  const initialErrorState = {
    category: '',
    title: '',
    description: '',
  };
  const categoryRef = useRef();
  const descriptionRef = useRef();
  const idRef = useRef();
  const titleRef = useRef();
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState('');
  const [todo, setTodo] = useState({
    work: [],
    personal: [],
  });
  const [error, setError] = useState({
    ...initialErrorState,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeCategory = event => {
    setCategory(event.target.value);
  };

  const addTodo = () => {
    setError({
      ...initialErrorState,
    });

    let object;
    let array;
    let categoryError;
    let titleError;
    let descriptionError;

    const {
      current: { value: categoryValue },
    } = categoryRef;

    if (!categoryValue) {
      categoryError = 'Selecione uma categoria';
    }

    const {
      current: { value: title },
    } = titleRef;

    if (!title) {
      titleError = 'Digite um título';
    } else if (title.length > 20) {
      titleError = 'Tamanho máximo do campo título é de 20 caracteres';
    }

    const {
      current: { value: description },
    } = descriptionRef;

    if (!description) {
      descriptionError = 'Digite uma descrição';
    } else if (description.length > 100) {
      descriptionError =
        'Tamanho máximo do campo descrição é de 100 caracteres';
    }

    if (descriptionError || titleError || categoryError) {
      setError({
        category: categoryError,
        title: titleError,
        description: descriptionError,
      });
      return;
    }

    const {
      current: { value: id },
    } = idRef;

    if (id) {
      array = todo.personal.concat(todo.work);
      const found = array.find(item => item.id === id);
      const index = todo[found.category].findIndex(item => item.id === id);

      if (found.category === categoryValue) {
        array = [...todo[categoryValue]];
        array[index].description = description;
        array[index].title = title;
        array[index].time.updatedAt = moment();

        object = {
          ...todo,
          [categoryValue]: array,
        };
      } else {
        array = [...todo[found.category]];
        array.splice(index, 1);
        object = {
          ...todo,
          [found.category]: array,
        };
        object[categoryValue].push({
          ...found,
          description,
          title,
          category: categoryValue,
          time: {
            ...found.time,
            updatedAt: moment(),
          },
        });
      }
    } else {
      object = {
        ...todo,
      };

      object[categoryValue].push({
        category: categoryValue,
        description,
        done: false,
        id: uuid(),
        time: {
          createdAt: moment(),
          doneAt: undefined,
          updatedAt: moment(),
        },
        title,
      });
    }

    setTodo({
      ...todo,
      ...object,
    });

    idRef.current.value = null;
    descriptionRef.current.value = null;
    titleRef.current.value = null;
    handleChangeCategory({
      target: {
        value: '',
      },
    });
  };

  const removeTodo = removeThis => {
    const array = [...todo[removeThis.category]];
    const index = array.indexOf(removeThis);
    array.splice(index, 1);
    setTodo({
      ...todo,
      [removeThis.category]: array,
    });
  };

  const doneTodo = doneThis => {
    const array = [...todo[doneThis.category]];
    const index = array.indexOf(doneThis);

    array[index].done = !array[index].done;
    array[index].time.doneAt = array[index].done ? moment() : undefined;

    setTodo({
      ...todo,
      [doneThis.category]: array,
    });
  };

  const editTodo = editThis => {
    const { id, description, title, category: categoryValue } = editThis;
    idRef.current.value = id;
    descriptionRef.current.value = description;
    titleRef.current.value = title;
    handleChangeCategory({
      target: {
        value: categoryValue,
      },
    });
  };

  const cancel = () => {
    idRef.current.value = null;
    descriptionRef.current.value = null;
    titleRef.current.value = null;
    handleChangeCategory({
      target: {
        value: '',
      },
    });
  };

  const { personal, work } = todo;

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h3" gutterBottom component="div">
            Criar Tarefa
          </Typography>
          <input ref={idRef} type="hidden" />
          <TextField
            error={!!error.title}
            helperText={error.title}
            inputRef={titleRef}
            label="Título"
            sx={{ m: 1, minWidth: 200 }}
            variant="outlined"
          />
          <TextField
            error={!!error.description}
            helperText={error.description}
            inputRef={descriptionRef}
            label="Descrição"
            sx={{ m: 1, minWidth: 500 }}
            variant="outlined"
          />
          <FormControl sx={{ m: 1, minWidth: 200 }} error={!!error.category}>
            <InputLabel>Categoria</InputLabel>
            <Select
              inputRef={categoryRef}
              label="Categoria"
              value={category}
              onChange={handleChangeCategory}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="personal">Pessoal</MenuItem>
              <MenuItem value="work">Trabalho</MenuItem>
            </Select>
            <FormHelperText>{error.category}</FormHelperText>
          </FormControl>
          <Button
            color={idRef?.current?.value ? 'success' : 'primary'}
            sx={{
              m: 1,
              minWidth: 100,
              minHeight: 56,
            }}
            variant="contained"
            onClick={addTodo}
          >
            {idRef?.current?.value ? 'Salvar' : 'Adicionar'}
          </Button>
          {idRef?.current?.value && (
            <Button
              color="error"
              sx={{
                m: 1,
                minWidth: 100,
                minHeight: 56,
              }}
              variant="contained"
              onClick={cancel}
            >
              Cancelar
            </Button>
          )}
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Todo Pessoal" />
            <Tab label="Todo Trabalho" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ListTodo
            idRef={idRef}
            listTodo={personal}
            onRemove={removeTodo}
            onEdit={editTodo}
            onDone={doneTodo}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ListTodo
            idRef={idRef}
            listTodo={work}
            onRemove={removeTodo}
            onEdit={editTodo}
            onDone={doneTodo}
          />
        </TabPanel>
      </Box>
    </>
  );
};

export default App;
