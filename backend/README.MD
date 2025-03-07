# User Registration, Login, Profile, and Logout API Documentation

This document provides detailed information about the User Registration, Login, Profile, and Logout APIs, including their endpoints, request/response formats, and validation requirements.

---

## **1. User Registration Endpoint**

**POST** `/users/register`

### **Description**

This endpoint allows users to register a new account. It validates the provided information and creates a new user in the database.

### **Request Body**

```json
{
  "fullname": {
    "firstname": "string", // Required, minimum 3 characters
    "lastname": "string"   // Optional, minimum 3 characters
  },
  "email": "string",      // Required, valid email format, minimum 5 characters
  "password": "string"    // Required, minimum 8 characters
}
```

---

## **2. User Login Endpoint**

**POST** `/users/login`

### **Description**

This endpoint allows users to log in with their registered email and password.

### **Request Body**

```json
{
  "email": "string",      // Required, valid email format
  "password": "string"    // Required, minimum 8 characters
}
```

---

## **Example Request**

```http
POST /users/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword"
}
```

---

## **Response Body**

```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "65cd1234567890abcdef1234",
    "socketId": null
  }
}
```

---

## **Error Response**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid_value",
      "msg": "Invalid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

## **Validation Rules**

- **email**: Required, must be a valid email format.
- **password**: Required, minimum length of 8 characters.

---

## **Notes**
- Make sure to send `Content-Type: application/json` in the request headers.
- The `token` is a JWT used for authentication in subsequent API requests.

---

## **3. User Profile Endpoint**

**GET** `/users/profile`

### **Description**

This endpoint allows users to retrieve their profile information using a valid JWT token.

### **Request Headers**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNkMTIzNDU2Nzg5MGFiY2RlZjEyMzQiLC
```

---

## **Error Response**

```json
{
  "message": "Unauthorized"
}
```

---

## **4. User Logout Endpoint**

**GET** `/users/logout`

### **Description**

This endpoint allows users to log out using a valid JWT token.

### **Request Headers**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNkMTIzNDU2Nzg5MGFiY2RlZjEyMzQiLC
```

---

## **Response Body**

```json
{
  "message": "Logout Successfully"
}
```

# Captain Registration API Documentation

This document provides detailed information about the Captain Registration API, including its endpoint, request/response formats, and validation requirements.

---

## **1. Captain Registration Endpoint**

**POST** `/captains/signup`

### **Description**

This endpoint allows captains to register a new account. It validates the provided information and creates a new captain in the database.

### **Request Body**

The request body must be a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "string", // Required, minimum 3 characters
    "lastname": "string"   // Optional, minimum 3 characters
  },
  "email": "string",      // Required, valid email format, minimum 5 characters
  "password": "string",   // Required, minimum 8 characters
  "vehicle": {
    "vehicleColor": "string",    // Required, minimum 3 characters
    "vehiclePlate": "string",    // Required, minimum 3 characters
    "vehicleCapacity": "number", // Required, minimum 1
    "vehicleType": "string",     // Required, must be one of ["Car", "Motorcycle", "Autorickshaw"]
    "vehicleModel": "string",    // Required, minimum 3 characters
    "vehicleBrand": "string",    // Required, minimum 3 characters
    "vehicleYear": "number",     // Required, minimum 1900
    "vehicleNumber": "string",   // Required, minimum 3 characters
    "vehicleStatus": "string"    // Required, must be one of ["available", "unavailable"]
  }
}
```

## **Example Request**

```http
POST /captains/signup
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword",
  "vehicle": {
    "vehicleColor": "Red",
    "vehiclePlate": "XYZ123",
    "vehicleCapacity": 4,
    "vehicleType": "Car",
    "vehicleModel": "Model S",
    "vehicleBrand": "Tesla",
    "vehicleYear": 2020,
    "vehicleNumber": "12345",
    "vehicleStatus": "available"
  }
}
```

## **Response Body**

```json
{
  "captain": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "65cd1234567890abcdef1234",
    "socketId": null,
    "isOnline": "offline",
    "vehicle": {
      "vehicleColor": "Red",
      "vehiclePlate": "XYZ123",
      "vehicleCapacity": 4,
      "vehicleType": "Car",
      "vehicleModel": "Model S",
      "vehicleBrand": "Tesla",
      "vehicleYear": 2020,
      "vehicleNumber": "12345",
      "vehicleStatus": "available"
    },
    "location": {
      "latitude": null,
      "longitude": null
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNkMTIzNDU2Nzg5MGFiY2RlZjEyMzQiLC"
}
```

