# Task Manager API

A backend REST API for managing tasks built using Django REST Framework.

## Features

- User Registration
- JWT Authentication
- Task CRUD Operations
- Filtering and Search
- Pagination
- Task Analytics API

## Tech Stack

- Python
- Django
- Django REST Framework
- SQLite (can be upgraded to PostgreSQL)

## API Endpoints

POST /api/users/register  
POST /api/users/login  

GET /api/tasks/  
POST /api/tasks/  

GET /api/tasks/{id}/  
PUT /api/tasks/{id}/  
DELETE /api/tasks/{id}/  

GET /api/tasks/stats/

## Author

Krrish