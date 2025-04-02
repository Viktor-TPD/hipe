# API Route References

This document provides a reference for all API endpoints in the application.

## Authentication Routes

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/v1/auth/register` | Register a new user |
| POST   | `/api/v1/auth/login`    | Login user          |
| POST   | `/api/v1/auth/verify`   | Verify user session |
| POST   | `/api/v1/auth/logout`   | Logout user         |

## Student Profile Routes

| Method | Endpoint               | Description                                      |
| ------ | ---------------------- | ------------------------------------------------ |
| GET    | `/api/v1/students`     | Get all student profiles (with optional filters) |
| GET    | `/api/v1/students/:id` | Get a specific student profile                   |
| POST   | `/api/v1/students`     | Create a new student profile                     |
| PUT    | `/api/v1/students/:id` | Update a student profile                         |
| DELETE | `/api/v1/students/:id` | Delete a student profile                         |

## Company Profile Routes

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| GET    | `/api/v1/companies`     | Get all company profiles       |
| GET    | `/api/v1/companies/:id` | Get a specific company profile |
| POST   | `/api/v1/companies`     | Create a new company profile   |
| PUT    | `/api/v1/companies/:id` | Update a company profile       |
| DELETE | `/api/v1/companies/:id` | Delete a company profile       |

## User Routes

| Method | Endpoint                    | Description                               |
| ------ | --------------------------- | ----------------------------------------- |
| GET    | `/api/v1/users`             | Get all users                             |
| GET    | `/api/v1/users/:id`         | Get a specific user                       |
| GET    | `/api/v1/users/:id/profile` | Get a user's profile (student or company) |
| PUT    | `/api/v1/users/:id`         | Update user data                          |
| DELETE | `/api/v1/users/:id`         | Delete a user and their profile           |

## Likes Routes

| Method | Endpoint            | Description                                |
| ------ | ------------------- | ------------------------------------------ |
| GET    | `/api/v1/likes`     | Get all likes with optional filtering      |
| GET    | `/api/v1/likes/:id` | Get a specific like                        |
| POST   | `/api/v1/likes`     | Create a new like                          |
| PUT    | `/api/v1/likes/:id` | Update a like (e.g. change isPoked status) |
| DELETE | `/api/v1/likes/:id` | Delete a like                              |

## Upload Routes

| Method | Endpoint                                | Description            |
| ------ | --------------------------------------- | ---------------------- |
| POST   | `/api/v1/uploads/profile-image/:userId` | Upload a profile image |
| DELETE | `/api/v1/uploads/profile-image/:userId` | Remove a profile image |
