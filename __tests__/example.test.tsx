import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function ExampleComponent({ message }: { message: string }) {
  return <div data-testid="example">{message}</div>;
}

describe('Example Test Suite', () => {
  it('should render a component with the correct message', () => {
    render(<ExampleComponent message="Hello, Jest!" />);
    
    const element = screen.getByTestId('example');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello, Jest!');
  });

  it('should perform basic assertions', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toContain('ell');
    expect([1, 2, 3]).toHaveLength(3);
  });
});

function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
    </div>
  );
}

describe('User Interaction Tests', () => {
  it('should handle button clicks with userEvent', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    
    await user.click(screen.getByText('Increment'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    
    await user.click(screen.getByText('Increment'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    
    await user.click(screen.getByText('Decrement'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });
});

function FormComponent({ onSubmit }: { onSubmit: (data: { email: string }) => void }) {
  const [email, setEmail] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        data-testid="email-input"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

describe('Form Interaction Tests', () => {
  it('should handle form input and submission', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    
    render(<FormComponent onSubmit={mockSubmit} />);
    
    const input = screen.getByTestId('email-input');
    await user.type(input, 'test@example.com');
    
    expect(input).toHaveValue('test@example.com');
    
    await user.click(screen.getByText('Submit'));
    
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});

function AsyncComponent() {
  const [data, setData] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    setData('Loaded data');
    setLoading(false);
  };
  
  return (
    <div>
      {loading && <span data-testid="loading">Loading...</span>}
      {data && <span data-testid="data">{data}</span>}
      <button onClick={fetchData}>Load Data</button>
    </div>
  );
}

describe('Async Operation Tests', () => {
  it('should handle async operations', async () => {
    const user = userEvent.setup();
    render(<AsyncComponent />);
    
    expect(screen.queryByTestId('data')).not.toBeInTheDocument();
    
    await user.click(screen.getByText('Load Data'));
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('data')).toHaveTextContent('Loaded data');
    });
    
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });
});

describe('Mocking Tests', () => {
  it('should mock functions', () => {
    const mockFn = jest.fn();
    mockFn('arg1', 'arg2');
    
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });
  
  it('should mock return values', () => {
    const mockFn = jest.fn()
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second')
      .mockReturnValue('default');
    
    expect(mockFn()).toBe('first');
    expect(mockFn()).toBe('second');
    expect(mockFn()).toBe('default');
    expect(mockFn()).toBe('default');
  });
  
  it('should mock async functions', async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue({ data: 'test' });
    
    const result = await mockAsyncFn();
    
    expect(result).toEqual({ data: 'test' });
  });
});

function useCounter(initialValue = 0) {
  const [count, setCount] = React.useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

function HookTestComponent({ initialValue }: { initialValue?: number }) {
  const { count, increment, decrement, reset } = useCounter(initialValue);
  
  return (
    <div>
      <span data-testid="hook-count">{count}</span>
      <button onClick={increment}>Hook Increment</button>
      <button onClick={decrement}>Hook Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

describe('Custom Hook Tests', () => {
  it('should test custom hooks through component', async () => {
    const user = userEvent.setup();
    render(<HookTestComponent initialValue={5} />);
    
    expect(screen.getByTestId('hook-count')).toHaveTextContent('5');
    
    await user.click(screen.getByText('Hook Increment'));
    expect(screen.getByTestId('hook-count')).toHaveTextContent('6');
    
    await user.click(screen.getByText('Hook Decrement'));
    await user.click(screen.getByText('Hook Decrement'));
    expect(screen.getByTestId('hook-count')).toHaveTextContent('4');
    
    await user.click(screen.getByText('Reset'));
    expect(screen.getByTestId('hook-count')).toHaveTextContent('5');
  });
});
