import React from 'react';
import {
  render,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

import App from '../index';

import * as response from '../../../__mocks__/response.json';

jest.mock('axios');

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Should component render correctly...', () => {
    it('With some content', async () => {
      axios.get.mockResolvedValue(response);

      const { getByText, getAllByText } = render(<App />);
      expect(getByText('Carregando...')).toBeInTheDocument();
      await waitForElementToBeRemoved(() => getByText('Carregando...'));
      response.data.results.forEach(el => {
        expect(getAllByText(el.name)[0]).toBeInTheDocument();
        expect(getAllByText(el.name)[1]).toBeInTheDocument();
      });
    });

    it('When has error', async () => {
      axios.get.mockRejectedValue({});

      const { getByText } = render(<App />);

      expect(getByText('Carregando...')).toBeInTheDocument();
      await waitForElementToBeRemoved(() => getByText('Carregando...'));
      expect(getByText('Erro ao pesquisar dados')).toBeInTheDocument();
    });
  });

  describe('Actions in component', () => {
    describe('Action "removeItem" works correctly...', () => {
      it('Selecting an element before deleting', async () => {
        axios.get.mockResolvedValue(response);

        const { getAllByText, queryAllByText, getByText, getByTestId } = render(
          <App />
        );
        const element = response.data.results[0];

        await waitForElementToBeRemoved(() => getByText('Carregando...'));
        expect(getAllByText(element.name)[0]).toBeInTheDocument();
        expect(getAllByText(element.name)[1]).toBeInTheDocument();
        expect(getByTestId('select')).toHaveValue('');
        fireEvent.change(getByTestId('select'), {
          target: { value: element.id },
        });
        expect(getByTestId('select')).toHaveValue(element.id);
        fireEvent.click(getByText('excluir'));
        expect(queryAllByText(element.name)[0]).toBeUndefined();
      });

      it('Not selecting an element before deleting', async () => {
        axios.get.mockResolvedValue(response);

        const { getByText, queryByText } = render(<App />);
        await waitForElementToBeRemoved(() => getByText('Carregando...'));
        expect(
          queryByText('Escolha um item para excluir')
        ).not.toBeInTheDocument();
        fireEvent.click(getByText('excluir'));
        expect(getByText('Escolha um item para excluir')).toBeInTheDocument();
      });
    });
  });
});
