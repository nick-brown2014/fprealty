import { render, screen } from '@testing-library/react';

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
