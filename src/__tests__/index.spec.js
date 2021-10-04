import ReactDOM from 'react-dom';

describe('index', () => {
  beforeAll(() => {
    ReactDOM.render = jest.fn();
  });

  it('Should call ReactDOM.render correctly', () => {
    require('../index');
    expect(ReactDOM.render).toHaveBeenCalledTimes(1);
  });
});
