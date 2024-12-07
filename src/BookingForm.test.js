import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookingForm from './BookingForm';

describe('BookingForm HTML5 Validation Attributes', () => {
    beforeEach(() => {
        // Mock fetchAPI
        window.fetchAPI = jest.fn(() => ['17:00', '18:00', '19:00', '20:00']);
    });

    test('date input has required attributes', () => {
        render(<BookingForm submitForm={() => {}} />);
        const dateInput = screen.getByLabelText(/Choose date/i);
        
        expect(dateInput).toHaveAttribute('required');
        expect(dateInput).toHaveAttribute('type', 'date');
        expect(dateInput).toHaveAttribute('min', new Date().toISOString().split('T')[0]);
    });

    test('time select has required attribute', () => {
        render(<BookingForm submitForm={() => {}} />);
        const timeSelect = screen.getByLabelText(/Choose time/i);
        
        expect(timeSelect).toHaveAttribute('required');
    });

    test('guests input has correct attributes', () => {
        render(<BookingForm submitForm={() => {}} />);
        const guestsInput = screen.getByLabelText(/Number of guests/i);
        
        expect(guestsInput).toHaveAttribute('required');
        expect(guestsInput).toHaveAttribute('type', 'number');
        expect(guestsInput).toHaveAttribute('min', '1');
        expect(guestsInput).toHaveAttribute('max', '10');
    });

    test('email input has correct attributes', () => {
        render(<BookingForm submitForm={() => {}} />);
        const emailInput = screen.getByLabelText(/Email/i);
        
        expect(emailInput).toHaveAttribute('required');
        expect(emailInput).toHaveAttribute('type', 'email');
    });
});

describe('BookingForm JavaScript Validation', () => {
    test('form should be invalid with empty fields', () => {
        render(<BookingForm submitForm={() => {}} />);
        const submitButton = screen.getByText(/Make Your reservation/i);
        expect(submitButton).toBeDisabled();
    });

    test('form should show error for invalid email', () => {
        render(<BookingForm submitForm={() => {}} />);
        const emailInput = screen.getByLabelText(/Email/i);
        
        fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
        
        const emailError = screen.getByText(/Email is invalid/i);
        expect(emailError).toBeInTheDocument();
    });

    test('form should show error for invalid number of guests', () => {
        render(<BookingForm submitForm={() => {}} />);
        const guestsInput = screen.getByLabelText(/Number of guests/i);
        
        fireEvent.change(guestsInput, { target: { value: '11' } });
        
        const guestsError = screen.getByText(/Maximum 10 guests allowed/i);
        expect(guestsError).toBeInTheDocument();
    });

    test('form should be valid with all fields filled correctly', () => {
        render(<BookingForm submitForm={() => {}} />);
        
        // Fill all required fields with valid data
        fireEvent.change(screen.getByLabelText(/Choose date/i), {
            target: { value: '2024-12-08' }
        });
        
        fireEvent.change(screen.getByLabelText(/Choose time/i), {
            target: { value: '17:00' }
        });
        
        fireEvent.change(screen.getByLabelText(/Name/i), {
            target: { value: 'John Doe' }
        });
        
        fireEvent.change(screen.getByLabelText(/Email/i), {
            target: { value: 'john@example.com' }
        });
        
        fireEvent.change(screen.getByLabelText(/Number of guests/i), {
            target: { value: '4' }
        });
        
        const submitButton = screen.getByText(/Make Your reservation/i);
        expect(submitButton).not.toBeDisabled();
    });

    test('submit handler should be called with valid data', () => {
        const mockSubmit = jest.fn();
        render(<BookingForm submitForm={mockSubmit} />);
        
        // Fill form with valid data
        fireEvent.change(screen.getByLabelText(/Choose date/i), {
            target: { value: '2024-12-08' }
        });
        
        fireEvent.change(screen.getByLabelText(/Choose time/i), {
            target: { value: '17:00' }
        });
        
        fireEvent.change(screen.getByLabelText(/Name/i), {
            target: { value: 'John Doe' }
        });
        
        fireEvent.change(screen.getByLabelText(/Email/i), {
            target: { value: 'john@example.com' }
        });
        
        fireEvent.change(screen.getByLabelText(/Number of guests/i), {
            target: { value: '4' }
        });
        
        // Submit form
        const submitButton = screen.getByText(/Make Your reservation/i);
        fireEvent.click(submitButton);
        
        expect(mockSubmit).toHaveBeenCalled();
    });
});