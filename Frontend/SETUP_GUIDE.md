# Angular Insurance Management Frontend

This is a complete Angular frontend for the Django Insurance Management REST API backend.

## Features

- **User Management** - Create, Read, Update, Delete users
- **Agent Management** - Manage insurance agents with license info and commission tracking
- **Customer Management** - Handle customer records with contact information
- **Policy Management** - Create and manage insurance policies
- **Plan Management** - Configure insurance plans with premium information
- **Insurance Company Management** - Maintain insurance company details
- **Insurance Type Management** - Define insurance types and categories
- **Customer Policy Assignment** - Link customers with policies
- **Authentication** - Login/logout with token-based authentication
- **Dashboard** - Overview of all entities with statistics

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v21 or higher)
- Django backend running on `http://127.0.0.1:8000`

## Installation

1. **Install Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Configure Backend URL**
   - The default backend URL is `http://127.0.0.1:8000`
   - If your backend runs on a different URL, update it in `src/app/services/api.service.ts`

## Running the Application

### Development Server

Start the Angular development server on port 8080:

```bash
npm start
```

The application will be available at `http://localhost:4200`

To run on a specific port (8080):
```bash
ng serve --port 8080
```

### Production Build

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/           # Login page
│   │   ├── navbar/          # Navigation bar
│   │   ├── dashboard/       # Dashboard with statistics
│   │   ├── user/            # User management
│   │   ├── agent/           # Agent management
│   │   ├── customer/        # Customer management
│   │   ├── policy/          # Policy management
│   │   ├── plan/            # Plan management
│   │   ├── insurance-company/   # Company management
│   │   ├── insurance-type/      # Insurance type management
│   │   └── customer-policy/     # Customer policy assignment
│   ├── services/
│   │   └── api.service.ts   # HTTP API service
│   ├── guards/
│   │   └── auth.guard.ts    # Route authentication guard
│   ├── interceptors/
│   │   └── auth.interceptor.ts  # HTTP interceptor for auth token
│   ├── app.ts               # Root component
│   ├── app.config.ts        # App configuration
│   ├── app.routes.ts        # Route definitions
│   └── app.css              # Global component styles
├── styles.css               # Global styles
└── main.ts                  # Application entry point
```

## API Integration

The frontend communicates with the Django REST API at `http://127.0.0.1:8000/api/`

### Available Endpoints

- **Users**: `/api/user/` - GET, POST, PUT, DELETE
- **Customers**: `/api/customer/` - GET, POST, PUT, DELETE
- **Agents**: `/api/agent/` - GET, POST, PUT, DELETE
- **Policies**: `/api/policy/` - GET, POST, PUT, DELETE
- **Plans**: `/api/plan/` - GET, POST, PUT, DELETE
- **Insurance Companies**: `/api/insurancecompany/` - GET, POST, PUT, DELETE
- **Insurance Types**: `/api/insurancetype/` - GET, POST, PUT, DELETE
- **Customer Policies**: `/api/customerpolicy/` - GET, POST, PUT, DELETE

## Authentication

The application uses token-based authentication:

1. User logs in with username and password
2. Backend returns an authentication token
3. Token is stored in localStorage
4. Token is automatically added to all subsequent requests via HTTP interceptor
5. If authentication fails, user is redirected to login page

## Styling

The application uses:
- **Bootstrap 5.3** - For responsive grid and components
- **Font Awesome 6.4** - For icons
- **Custom CSS** - For gradient backgrounds and custom styling
- **Modern color palette** - Purple, blue, and teal gradients

## Development

### Run tests
```bash
npm test
```

### Build for production
```bash
npm run build
```

### Deploy to server
After building, copy the contents of `dist/Frontend/browser` to your web server.

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the Django backend has CORS enabled. Check the `CORS_CONFIGURATION.txt` file in the Backend folder.

### Connection to Backend
- Verify the backend is running on `http://127.0.0.1:8000`
- Check the backend logs for errors
- Ensure the API endpoints are correctly configured

### Login Issues
- Clear browser cache and localStorage
- Check that the backend is running
- Verify database credentials in Django settings

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Variables

Currently, the application uses hardcoded API URL. For production, consider using environment files:

```bash
# Create environment.ts
export const environment = {
  apiUrl: 'http://your-api-url:8000/api'
};
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the Insurance Management System.

## Support

For issues or questions, refer to the Backend documentation in `Backend/Notes/` directory.
