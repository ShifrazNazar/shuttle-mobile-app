# Forgot Password Feature

## Overview

The forgot password feature allows both drivers and students to reset their passwords if they forget them.

## How it Works

### 1. User Flow

1. User clicks "Forgot Password?" on login screen
2. User enters their email address
3. System sends password reset email (if account exists)
4. User receives email with reset link
5. User clicks link and sets new password
6. User can log in with new password

### 2. Security Features

- **Email validation**: Basic email format validation
- **Privacy protection**: Doesn't reveal if email exists or not
- **Firebase integration**: Uses Firebase Auth password reset
- **Rate limiting**: Firebase handles rate limiting automatically

### 3. Screens

- **Login Screen**: Has "Forgot Password?" link
- **Forgot Password Screen**: Email input and reset request
- **Password Reset Screen**: For first-time login password changes

### 4. Technical Implementation

- Uses Firebase `sendPasswordResetEmail()` function
- Consistent theme with rest of app
- Error handling and loading states
- Navigation between auth screens

### 5. Admin Support

- Help section with admin contact
- Clear instructions for users
- Fallback contact method

## Files Modified

- `screens/auth/ForgotPasswordScreen.tsx` - New screen
- `app/(auth)/forgot-password.tsx` - Route file
- `screens/auth/LoginScreen.tsx` - Added forgot password link
- `screens/auth/PasswordResetScreen.tsx` - Added back to login link
- `app/global.css` - Added theme utilities

## Testing

1. Try with valid email (should send reset email)
2. Try with invalid email format (should show validation error)
3. Try with non-existent email (should show success message for privacy)
4. Test navigation between screens
5. Test loading states and error handling
