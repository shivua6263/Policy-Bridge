# Policy-Bridge

## Project Description

Policy-Bridge is a comprehensive insurance management platform that allows users to browse, purchase, and manage insurance policies from various insurance companies. The system supports multiple user roles including customers, agents, and administrators, providing a complete solution for insurance policy management.

## Features

- **User Management**: Admin users to manage the platform
- **Customer Management**: Customer registration, login, and profile management
- **Agent Management**: Insurance agents with license info and commission tracking
- **Policy Management**: Create and manage various insurance policies
- **Plan Management**: Configure insurance plans with premium details
- **Insurance Company Management**: Maintain details of insurance providers
- **Insurance Type Management**: Define different types of insurance (health, car, life, etc.)
- **Customer Policy Assignment**: Link customers with their purchased policies
- **Claims Management**: Handle insurance claims with real-time updates via WebSockets
- **Support System**: Customer support tickets and management
- **Authentication**: Secure login/logout with JWT tokens
- **Dashboards**: Role-based dashboards for agents, customers, and admins

## Tech Stack

### Backend
- **Framework**: Django 4.2.17
- **API Framework**: Django REST Framework (DRF)
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Features**: Django Channels with Redis
- **CORS**: django-cors-headers

### Frontend
- **Angular Frontend**: Angular 21+ with TypeScript
- **Customer Frontend**: HTML/CSS/JavaScript with AngularJS
- **Reference Frontend**: Static HTML/JS for reference

### Additional Tools
- **WebSockets**: For real-time claims updates
- **Bootstrap**: For responsive UI design

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm 9+
- Angular CLI 21+
- Git

## Installation and Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Policy-Bridge
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd Backend/restapi
pip install -r requirements.txt
```

#### Database Setup
```bash
python manage.py migrate
```

#### Populate Sample Data (Optional)
```bash
python populate_data.py
```

#### Run Backend Server
```bash
python manage.py runserver
```
The backend will be available at `http://127.0.0.1:8000`

### 3. Angular Frontend Setup

#### Install Dependencies
```bash
cd ../../Frontend
npm install
```

#### Configure Backend URL (if needed)
Update `src/app/services/api.service.ts` if backend URL differs from `http://127.0.0.1:8000`

#### Run Angular Development Server
```bash
npm start
```
The Angular frontend will be available at `http://localhost:4200`

### 4. Customer Frontend Setup

#### Start Simple HTTP Server
```bash
cd ../Customer\ Frontend
python -m http.server 3000
```
The customer frontend will be available at `http://localhost:3000`

## Running the Project

1. Start the Django backend server on port 8000
2. Start the Angular frontend on port 4200
3. Start the Customer frontend on port 3000
4. Access the applications through their respective URLs

## Testing

### Backend Tests
```bash
cd Backend/restapi
python manage.py test
```

### Frontend Tests
```bash
cd Frontend
ng test
```

## API Documentation

All API endpoints are documented in `Backend/ALL_API_ENDPOINTS.txt`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.