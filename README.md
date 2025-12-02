# Fitness-Project
T120B165 Fitness-Project is a forum based web application with React frontend and .net backend that allows users to check on different exercise categories, exercises as well as to input their own opinion.

Fitness-Project:.
```bash
Fitness-Project/
├───.README.md
├───.frontend/ #react project
└───backend/ #.NET API SERVER
    ├───Controllers/ #API ROUTE HANDLERS
    ├───Data/ #DATABASE 
    ├───Migrations/ #DATABASE VERSIONS
    ├───Models/ #DATABASE MODELS
    ├───Views/ #API PAGES
```
## Features:

* Categories Management: Create, read, update, and delete discussion categories
* Exercises Management: Create and manage exercises within categories
* Comments System: Add comments to exercises
* User Authentication: Registration & login with JWT tokens
* RESTful API: Full CRUD operations with proper HTTP status codes
* API Documentation: Interactive Swagger documentation
* Database Relations: Proper foreign key relationships between entities
* Pagination: Paginated responses for list endpoints


## Technology Stack

### Backend
- ASP.NET Core – Web API framework
- Entity Framework Core – Database ORM
- MySQL – Database
- Swagger – API documentation

### Frontend (finished)
- React – UI library
- TypeScript – Typed JavaScript
- Axios – HTTP client

## Starting the project

### Prerequisites:
* .NET (8.0 or higher)
* XAMMP (for MySQL control)

## backend setup

* Clone the repository:
git clone https://github.com/Talkevicius/Fitness-Project.git

### Enviroment setup:
* Configure database connection Open the backend project’s appsettings.json (or .env file if you use one) and set your database connection string.
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ChangeThisStringToYourDatabaseName;Trusted_Connection=True;"
  }
}
```
* run command:
```bash
dotnet ef database update
```
* Start the MySQL Database

### Start backend server

```bash
dotnet run
```

### Start frontend project

```bash
npm install #installs all dependencies and librariess
npm run dev
```

### Access the Application
* API Server: http://localhost:5214
* API Documentation: http://localhost:5214/swagger

## API ENDPOINTS
### Categories
* GET /api/categories — Get all categories (paginated)
* GET /api/categories/:id — Get category by ID
* POST /api/categories — Create new category
* PUT /api/categories/:id — Update category (full)
* PATCH /api/categories/:id — Update category (partial)
* DELETE /api/categories/:id — Delete category

### Exercises
* GET /api/exercises — Get all exercises (paginated)
* GET /api/exercises/:id — Get exercise by ID
* POST /api/exercises — Create new exercise
* PUT /api/exercises/:id — Update exercise (full)
* PATCH /api/exercises/:id — Update exercise (partial)
* DELETE /api/exercises/:id — Delete exercise

### Comments
* GET /api/comments - Get all comments (paginated)
* GET /api/comments/:id - Get comment by ID
* POST /api/comments - Create new comment
* PUT /api/comments/:id - Update comment (full)
* PATCH /api/comments/:id - Update comment (partial)
* DELETE /api/comments/:id - Delete comment

### Users
* POST /api/users/register - Create new user, return JWT token
* POST /api/users/login - authenticate user, return JWT token

## API Documentation
The API includes comprehensive Swagger documentation available at /swagger when the server is running.
## Error Handling
### The API uses standardized error responses:
* 400 - Bad Request (validation errors)
* 404 - Not Found (resource doesn't exist)
* 422 - Unprocessable Entity (empty request body)
* 500 — Internal Server Error