import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../src/state-management/authSlice';
import LoginForm from '../../src/components/session/loginForm';

const renderLoginForm = () => {
  const store = configureStore({
    reducer: { auth: authReducer },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </Provider>
  );
};

describe('LoginForm', () => {
  test('renders email and password fields', () => {
    renderLoginForm();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  });

  test('shows error when email missing @', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText(/email/i), 'invalidemail');
    await user.type(screen.getByPlaceholderText(/enter your password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Email must include @')
    ).toBeInTheDocument();
  });

  test('shows error when password too short', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByPlaceholderText(/enter your password/i), '123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      screen.getByText('Password must be at least 6 characters')
    ).toBeInTheDocument();
  });

  test('shows both errors when form is empty', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Email must include @')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Password must be at least 6 characters')
    ).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(
      screen.getByRole('button', { name: /toggle password visibility/i })
    );
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('clears form after submit', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByPlaceholderText(/enter your password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByPlaceholderText(/enter your password/i)).toHaveValue('');
    });
  });
});