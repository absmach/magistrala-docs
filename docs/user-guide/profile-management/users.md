---
title: Profile Management
description: Manage your personal user profile
keywords:
  - Magistrala Profile
  - User Settings
  - Change Password
  - Change Avatar
  - Themes
  - Language Settings
  - Password Reset
  - Theme Preferences
  - IoT User Management
image: /img/mg-preview.png
---

## User Profile

Each user has access to a **Profile Page**, where personal information, security settings, and preferences can be updated.

Clicking the `user profile picture` or `avatar` at the top right opens a popover.

## Standard User Menu

- **Profile**
- **Personal Access Tokens**
- **Domains**
- **Logout**

![User Popover](../../img/profile-management/jdoe-popover.png)

Selecting the Profile option reveals three main tabs:

### Account

The **Account** tab allows users to update their names, email and upload a profile picture.

![Profile Tab 1](../../img/profile-management/jdoe-profile.png)

### Password

The **Password** tab focuses on security. Users can change their password by entering their current password, followed by the new password (which **must** pass verification) and its confirmation.

![Profile Tab 2](../../img/profile-management/jdoe-password-tab.png)

### Preferences

The **Preferences** tab enables users to customize language and theme settings.

![Profile Tab 3](../../img/profile-management/jdoe-preferences-tab.png)

Magistrala currently supports **English**, **German**, and **Serbian** languages and offers four different themes to choose from.

![Themes](../../img/profile-management/jdoe-themes-tab.png)

## Password Recovery

Users who forget their password can initiate a password reset through the **Forgot Password** feature on the login page.

![Forgot Password Link](../../img/profile-management/forgot-pass.png)

Clicking the **Forgot Password?** link redirects the user to a dedicated **Forgot Password** page, where they must enter their registered email address.

![Forgot Password](../../img/profile-management/forgot-password2.png)

After submitting the request, Magistrala displays a success notification confirming that the reset link has been sent.

> **Password reset link sent successfully. Check your email.**

![Reset Link Toast](../../img/profile-management/password-link-sent.png)

A password reset email is then delivered to the user’s inbox.  
The email includes a personalized greeting and a button that directs the user to the password reset page.

![Password Reset Email](../../img/profile-management/pass-reset-email.png)

By clicking **Create a New Password**, the user is redirected to the **Reset Password** page, where they can create and confirm a new password.  
If the button does not work, the email also contains a fallback link that can be copied and pasted into a web browser.

![Password Reset Page](../../img/profile-management/reset-password.png)

> **Important:** The password reset link is valid for **24 hours** from the time of issue.

Once the password has been successfully updated, the user can return to the **Sign In** page and log in with the new credentials.
