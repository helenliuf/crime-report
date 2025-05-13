# API Documentation

## Table of Contents

- [API Documentation](#api-documentation)
  - [Table of Contents](#table-of-contents)
  - [User Routes](#user-routes)
    - [`POST /api/users/register`](#post-apiusersregister)
    - [`POST /api/users/login`](#post-apiuserslogin)
    - [`GET /api/users/:id/rewards`](#get-apiusersidrewards)
  - [Authentication Routes](#authentication-routes)
    - [`GET /api/auth/validatetoken`](#get-apiauthvalidatetoken)
  - [Crime Routes](#crime-routes)
    - [`GET /api/crimes/nearby`](#get-apicrimesnearby)
    - [`GET /api/crimes/:id`](#get-apicrimesid)
    - [`PUT /api/crimes/:id/verify`](#put-apicrimesidverify)
    - [`GET /api/crimes`](#get-apicrimes)
    - [`POST /api/crimes`](#post-apicrimes)


## User Routes

### `POST /api/users/register`
**Description**: Registers a new user.  
**Returns**:  
- `201 Created`: User successfully registered.  
- `400 Bad Request`: Invalid input data.  

---

### `POST /api/users/login`
**Description**: Logs in a user and returns a token.  
**Returns**:  
- `200 OK`: Login successful, returns a token and user details.  
- `400 Bad Request`: Missing or invalid credentials.  

---

### `GET /api/users/:id/rewards`
**Description**: Fetches the reward points for a specific user by their ID.  
**Returns**:  
- `200 OK`: Reward points for the user.  
- `404 Not Found`: User does not exist.  

---

## Authentication Routes

### `GET /api/auth/validatetoken`

**Description**: Validates the user's token to ensure it is still valid.
**Response**:
  - `200 OK`: Token is valid.
  - `401 Unauthorized`: Token is invalid or missing.
**Caching**:
  - `Cache-Control: no-store` ensures no caching of the response.

---

## Crime Routes

### `GET /api/crimes/nearby`
**Description**: Fetches a list of nearby crimes based on the user's location.  
**Returns**:  
- `200 OK`: List of nearby crimes.  
- `401 Unauthorized`: User is not authenticated.  
- `403 Forbidden`: User does not have the required role.

---

### `GET /api/crimes/:id`
**Description**: Fetches details of a specific crime report by its ID.  
**Returns**:  
- `200 OK`: Details of the crime report.  
- `401 Unauthorized`: User is not authenticated.  
- `403 Forbidden`: User does not have the required role.  
- `404 Not Found`: Crime report does not exist.

---

### `PUT /api/crimes/:id/verify`
**Description**: Verifies a specific crime report by its ID.  
**Returns**:  
- `200 OK`: Crime report successfully verified.  
- `401 Unauthorized`: User is not authenticated.  
- `403 Forbidden`: User does not have the required role.  
- `404 Not Found`: Crime report does not exist.

---

### `GET /api/crimes`
**Description**: Fetches a list of all crime reports.  
**Returns**:  
- `200 OK`: List of all crime reports.  
- `401 Unauthorized`: User is not authenticated.  
- `403 Forbidden`: User does not have the required role.

---

### `POST /api/crimes`
**Description**: Submits a new crime report.  
**Returns**:  
- `201 Created`: Crime report successfully created.  
- `400 Bad Request`: Request body is invalid.  
- `401 Unauthorized`: User is not authenticated.  
- `403 Forbidden`: User does not have the required role.

---