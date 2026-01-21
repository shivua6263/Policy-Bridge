Here's a design for your database schema with the required tables:

1. User Table (Admin Users)

id (Primary Key)

name (CharField)

email (EmailField, unique)

password (CharField, hashed)

phone_number (CharField, unique)

role (CharField: choices=['admin', 'super_admin'])

created_at (DateTimeField)

2. Customer Table

id (Primary Key)

name (CharField)

email (EmailField, unique)

password (CharField, hashed)

phone_number (CharField, unique)

role (CharField: choices=['customer'])

created_at (DateTimeField)

3. Plan Table

id (Primary Key)

user_id (ForeignKey to User)

plan_name (CharField)

plan_description (TextField)

price (DecimalField)

created_at (DateTimeField)

4. Insurance Company Table

id (Primary Key)

name (CharField)

address (CharField)

contact_info (CharField)

website (URLField)

created_at (DateTimeField)

5. Insurance Type Table

id (Primary Key)

type_name (CharField, choices=['health', 'car', 'life', etc.])

description (TextField)

created_at (DateTimeField)

6. Policy Table

id (Primary Key)

insurance_type_id (ForeignKey to InsuranceType)

insurance_company_id (ForeignKey to InsuranceCompany)

policy_name (CharField)

policy_details (TextField)

coverage (DecimalField)

premium_amount (DecimalField)

created_at (DateTimeField)

7. Agent Table

id (Primary Key)

name (CharField)

email (EmailField, unique)

phone_number (CharField, unique)

referral_code (CharField, unique) (used for referring customers)

commission_percentage (DecimalField)

created_at (DateTimeField)

8. Customer Policy Table

id (Primary Key)

customer_id (ForeignKey to Customer)

policy_id (ForeignKey to Policy)

agent_id (ForeignKey to Agent) (referring agent)

subscription_date (DateTimeField)

expiry_date (DateTimeField)

premium_amount_paid (DecimalField)

status (CharField: choices=['active', 'expired', 'cancelled'])