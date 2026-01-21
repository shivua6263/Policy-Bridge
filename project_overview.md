# Project Overview: Policy-Bridge

## Project Description

Policy-Bridge is a full-stack insurance management platform built with Django backend and multiple frontend implementations. The system enables customers to browse and purchase insurance policies, agents to manage their clients and commissions, and administrators to oversee the entire platform.

## Architecture Overview

The project follows a microservices-like architecture with:
- **Django REST API Backend**: Core business logic and data management
- **Multiple Frontend Clients**: Angular SPA, JavaScript-based customer portal, and reference implementations
- **Real-time Communication**: WebSocket support for claims updates
- **Role-based Access Control**: Different interfaces for customers, agents, and admins

## Project Structure

```
Policy-Bridge/
├── Backend/                          # Django Backend
│   ├── restapi/                      # Main Django Project
│   │   ├── manage.py                 # Django management script
│   │   ├── db.sqlite3                # SQLite database
│   │   ├── requirements.txt          # Python dependencies
│   │   ├── restapi/                  # Django settings
│   │   ├── agent/                    # Agent management app
│   │   ├── claims/                   # Claims management app
│   │   ├── customer/                 # Customer management app
│   │   ├── customerpolicy/           # Customer-policy relationships
│   │   ├── insurancecompany/         # Insurance companies
│   │   ├── insurancetype/            # Insurance types
│   │   ├── plan/                     # Insurance plans
│   │   ├── policy/                   # Insurance policies
│   │   ├── support/                  # Support system
│   │   ├── supportticket/            # Support tickets
│   │   ├── user/                     # User management
│   │   └── media/                    # File uploads
│   ├── ALL_API_ENDPOINTS.txt         # API documentation
│   ├── CORS_CONFIGURATION.txt        # CORS settings
│   └── Notes/                        # Project documentation
├── Customer Frontend/                # JavaScript-based customer portal
│   ├── *.html                       # HTML pages
│   ├── *.js                         # JavaScript files
│   ├── style.css                    # Styles
│   └── Doc/                         # Documentation
├── Frontend/                        # Angular SPA
│   ├── src/app/                     # Angular components
│   ├── package.json                 # Node dependencies
│   └── angular.json                 # Angular config
├── Reference Frontend/              # Static reference pages
│   ├── *.html                      # HTML templates
│   └── js/                         # JavaScript files
├── credentials.txt                  # API credentials
├── populate_data.py                # Data seeding script
├── quick_test.sh                   # Quick test script
└── test_all_systems.sh             # System test script
```

## Core Components

### Backend Apps

1. **User App**: Admin user management
2. **Customer App**: Customer registration and profiles
3. **Agent App**: Insurance agent management with licensing
4. **Policy App**: Insurance policy definitions
5. **Plan App**: Insurance plan configurations
6. **Insurance Company App**: Company information management
7. **Insurance Type App**: Categorization of insurance types
8. **Customer Policy App**: Linking customers to policies
9. **Claims App**: Claims processing with WebSocket updates
10. **Support App**: Customer support system
11. **Support Ticket App**: Ticket management

### Frontend Components

#### Angular Frontend
- **Authentication**: Login/logout with JWT
- **Dashboard**: Statistics and overview
- **Entity Management**: CRUD operations for all entities
- **API Integration**: RESTful API communication

#### Customer Frontend
- **Unified Login**: Customer and agent authentication
- **Role-based Dashboards**: Different views for customers/agents
- **Policy Management**: Browse and purchase policies
- **Profile Management**: User account settings

## Data Flow

### User Registration/Login Flow
1. User submits credentials via frontend
2. Frontend sends POST request to `/api/{role}/login/`
3. Backend validates credentials and returns JWT token
4. Token stored in localStorage/sessionStorage
5. Subsequent requests include Authorization header

### Policy Purchase Flow
1. Customer browses available policies
2. Selects plan and submits purchase request
3. Backend creates CustomerPolicy record
4. Payment processing (if implemented)
5. Confirmation sent to customer

### Claims Processing Flow
1. Customer submits claim via frontend
2. Claim created in database with "pending" status
3. WebSocket notification sent to relevant agents
4. Agent reviews and updates claim status
5. Real-time updates sent to customer via WebSocket

## Database Schema

### Core Tables

- **User**: Admin users (id, name, email, phone, address, role, created_at)
- **Customer**: Platform customers (id, name, email, password, phone, role, created_at)
- **Agent**: Insurance agents (id, name, email, phone, license_number, commission_rate, created_at)
- **InsuranceCompany**: Companies (id, name, address, contact_info, website, created_at)
- **InsuranceType**: Types (id, type_name, description, created_at)
- **Plan**: Insurance plans (id, user_id, plan_name, description, price, created_at)
- **Policy**: Policies (id, insurance_type_id, company_id, name, details, coverage, premium, created_at)
- **CustomerPolicy**: Customer-policy links (id, customer_id, policy_id, start_date, end_date, status)
- **Claim**: Insurance claims (id, customer_policy_id, description, amount, status, created_at)
- **SupportTicket**: Support requests (id, customer_id, subject, message, status, created_at)

## API Endpoints

### Authentication
- `POST /api/customer/login/` - Customer login
- `POST /api/agent/login/` - Agent login
- `POST /api/customer/signup/` - Customer registration
- `POST /api/agent/signup/` - Agent registration

### User Management
- `GET /api/user/` - List all users
- `POST /api/user/` - Create user
- `GET /api/user/{id}/` - Get user details
- `PUT /api/user/{id}/` - Update user
- `DELETE /api/user/{id}/` - Delete user

### Customer Management
- `GET /api/customer/` - List customers
- `POST /api/customer/` - Create customer
- `GET /api/customer/{id}/` - Get customer
- `PUT /api/customer/{id}/` - Update customer
- `DELETE /api/customer/{id}/` - Delete customer

### Agent Management
- `GET /api/agent/` - List agents
- `POST /api/agent/` - Create agent
- `GET /api/agent/{id}/` - Get agent
- `PUT /api/agent/{id}/` - Update agent
- `DELETE /api/agent/{id}/` - Delete agent

### Policy Management
- `GET /api/policy/` - List policies
- `POST /api/policy/` - Create policy
- `GET /api/policy/{id}/` - Get policy
- `PUT /api/policy/{id}/` - Update policy
- `DELETE /api/policy/{id}/` - Delete policy

### Claims Management
- `GET /api/claims/` - List claims
- `POST /api/claims/` - Create claim
- `GET /api/claims/{id}/` - Get claim
- `PUT /api/claims/{id}/` - Update claim
- `DELETE /api/claims/{id}/` - Delete claim
- WebSocket: `/ws/claims/{id}/` - Real-time claim updates

### Support System
- `GET /api/supportticket/` - List tickets
- `POST /api/supportticket/` - Create ticket
- `GET /api/supportticket/{id}/` - Get ticket
- `PUT /api/supportticket/{id}/` - Update ticket

## Technologies Used

### Backend
- **Django 4.2.17**: Web framework
- **Django REST Framework**: API development
- **SQLite3**: Database
- **JWT**: Authentication
- **Django Channels**: WebSocket support
- **Redis**: Channel layer for WebSockets
- **CORS Headers**: Cross-origin resource sharing

### Frontend
- **Angular 21+**: SPA framework
- **TypeScript**: Type-safe JavaScript
- **AngularJS**: Legacy customer portal
- **Bootstrap**: CSS framework
- **HTML5/CSS3**: Markup and styling
- **JavaScript ES6+**: Client-side logic

### Development Tools
- **Git**: Version control
- **npm**: Package management
- **Angular CLI**: Angular development
- **Django management commands**: Backend development

## Security Features

- JWT-based authentication
- Role-based access control
- CORS configuration
- Input validation
- Secure password handling
- API rate limiting (configurable)

## Real-time Features

- **Claims Updates**: WebSocket notifications for claim status changes
- **Live Support**: Real-time chat support (planned)
- **Dashboard Updates**: Live statistics updates

## Deployment Considerations

- **Backend**: Can be deployed on any WSGI server (Gunicorn, uWSGI)
- **Frontend**: Static hosting on CDN or web servers
- **Database**: SQLite for development, PostgreSQL/MySQL for production
- **WebSockets**: Redis for channel layer in production
- **SSL/TLS**: HTTPS required for production

## Future Enhancements

- Payment gateway integration
- Email notifications
- Advanced reporting and analytics
- Mobile app development
- Multi-language support
- Advanced search and filtering
- File upload for documents
- Audit logging

## Testing Strategy

- **Backend**: Django unit tests for models and APIs
- **Frontend**: Angular unit tests with Karma/Jasmine
- **Integration**: End-to-end testing with Selenium
- **API Testing**: Automated API tests with scripts

## Performance Optimization

- Database indexing on frequently queried fields
- API response caching
- Lazy loading in Angular
- Image optimization for uploads
- CDN for static assets