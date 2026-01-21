1. User Table (Admin Users)

This table will store the admin user details for your platform.

Field	Data Type	Description
id	Integer	Primary Key, Auto-increment
name	CharField	Full name of the user
email	EmailField	Unique, email of the user
password	CharField	Password, preferably hashed
phone_number	CharField	Phone number
role	CharField	Role of the user (e.g., admin)
created_at	DateTime	Timestamp when user is created
2. Customer Table

This table will store details for each customer.

Field	Data Type	Description
id	Integer	Primary Key, Auto-increment
name	CharField	Full name of the customer
email	EmailField	Unique, email of the customer
password	CharField	Password, preferably hashed
phone_number	CharField	Phone number
role	CharField	Role of the user (customer)
created_at	DateTime	Timestamp when customer created
referred_by	ForeignKey	Reference to Agent Table (nullable)

Relationships:

The referred_by field in the Customer table would reference the Agent table (if there is an agent associated with that customer).

3. InsuranceCompany Table

This table will hold all the details about the insurance companies.

Field	Data Type	Description
id	Integer	Primary Key, Auto-increment
name	CharField	Name of the insurance company
address	CharField	Physical address of the insurance company
contact_number	CharField	Contact number of the insurance company
email	EmailField	Email address of the insurance company
created_at	DateTime	Timestamp when the company is added
4. InsuranceType Table

This table will store the types of insurance available (e.g., health, car, life).

Field	Data Type	Description
id	Integer	Primary Key, Auto-increment
type_name	CharField	Type of insurance (Health, Car, Life, etc.)
description	Text	A brief description of this type of insurance
5. Policy Table

This table will store details about all the available insurance policies.

Field	Data Type	Description
id	Integer	Primary Key, Auto-increment
policy_name	CharField	Name of the policy (e.g., Health Plan A)
policy_number	CharField	Unique identifier for the policy
description	Text	Details of the policy
insurance_type	ForeignKey	Reference to InsuranceType table
insurance_company	ForeignKey	Reference to InsuranceCompany table
price	Decimal	Price of the policy
created_at	DateTime	Timestamp when the policy was created
6. Agent Table

This table will store details about agents who refer customers to purchase policies.

Field	Data Type	Description
id	Integer	Primary Key, Auto-increment
name	CharField	Full name of the agent
email	EmailField	Unique email of the agent
phone_number	CharField	Contact number of the agent
created_at	DateTime	Timestamp when the agent was created
referral_code	CharField	Unique referral code for the agent

Relationships:

The agent table is linked to the Customer table (via referred_by field in the Customer table).

7. CustomerPolicy Table

This table stores the policies purchased by customers.

Field	Data Type	Description
id	Integer	Primary Key, Auto-increment
customer	ForeignKey	Reference to Customer table
policy	ForeignKey	Reference to Policy table
purchase_date	DateTime	Timestamp when the policy was purchased
valid_until	DateTime	Expiry date of the policy

Relationships:

customer: Links to the Customer table.

policy: Links to the Policy table.

Database Relationships

User: One to Many relationship with Customer table (admin can manage multiple customers).

InsuranceCompany: One to Many relationship with Policy table (one company can have multiple policies).

InsuranceType: One to Many relationship with Policy table (one type can have multiple policies).

Agent: One to Many relationship with Customer table (one agent can refer multiple customers).

Customer: Many to Many relationship with Policy table (A customer can have multiple policies).

Django Model Creation Steps
Step 1: Define Models in models.py

First, create a models.py file in your Django app and define all these tables as Django models. Below is a basic representation for the models.

from django.db import models

# User Table
class User(models.Model):
    ADMIN = 'admin'
    USER_ROLE_CHOICES = [(ADMIN, 'Admin')]

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    role = models.CharField(max_length=10, choices=USER_ROLE_CHOICES, default=ADMIN)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Customer Table
class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    role = models.CharField(max_length=10, default='customer')
    created_at = models.DateTimeField(auto_now_add=True)
    referred_by = models.ForeignKey('Agent', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name

# InsuranceCompany Table
class InsuranceCompany(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=500)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# InsuranceType Table
class InsuranceType(models.Model):
    type_name = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return self.type_name

# Policy Table
class Policy(models.Model):
    policy_name = models.CharField(max_length=255)
    policy_number = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    insurance_type = models.ForeignKey(InsuranceType, on_delete=models.CASCADE)
    insurance_company = models.ForeignKey(InsuranceCompany, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.policy_name

# Agent Table
class Agent(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    referral_code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name

# CustomerPolicy Table
class CustomerPolicy(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add=True)
    valid_until = models.DateTimeField()

    def __str__(self):
        return f"{self.customer.name} - {self.policy.policy_name}"

Step 2: Run Migrations

Once the models are defined, run the following Django commands to create the database schema:

# Generate migration files for the app
python manage.py makemigrations

# Apply the migrations to the database
python manage.py migrate