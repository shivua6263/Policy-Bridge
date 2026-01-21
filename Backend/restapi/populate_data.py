#!/usr/bin/env python
import os
import django
import random
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restapi.settings')
django.setup()

from user.models import User
from agent.models import Agent
from customer.models import Customer
from insurancecompany.models import InsuranceCompany
from insurancetype.models import InsuranceType
from policy.models import Policy
from policy.models import Policy
from customerpolicy.models import CustomerPolicy
from claims.models import Claim
from supportticket.models import SupportTicket

def clear_all_data():
    """Clear all existing data"""
    print("Clearing all existing data...")
    SupportTicket.objects.all().delete()
    Claim.objects.all().delete()
    CustomerPolicy.objects.all().delete()
    Policy.objects.all().delete()
    InsuranceType.objects.all().delete()
    InsuranceCompany.objects.all().delete()
    Customer.objects.all().delete()
    Agent.objects.all().delete()
    User.objects.all().delete()
    print("All data cleared!")

def create_admin_user():
    """Create admin user"""
    print("Creating admin user...")
    admin = User.objects.create(
        name="Admin User",
        email="admin@gmail.com",
        phone="7483182277",
        address="Admin Address"
    )
    admin.set_password("Admin")
    admin.save()
    return admin

def create_agents():
    """Create 10 agents with Indian names"""
    print("Creating 10 agents...")
    agents_data = [
        {"name": "Rajesh Kumar", "email": "rajesh.kumar@agent.com", "phone": "9876543210"},
        {"name": "Priya Sharma", "email": "priya.sharma@agent.com", "phone": "9876543211"},
        {"name": "Amit Singh", "email": "amit.singh@agent.com", "phone": "9876543212"},
        {"name": "Sunita Patel", "email": "sunita.patel@agent.com", "phone": "9876543213"},
        {"name": "Vikram Joshi", "email": "vikram.joshi@agent.com", "phone": "9876543214"},
        {"name": "Deepak Verma", "email": "deepak.verma@agent.com", "phone": "9876543215"},
        {"name": "Kavita Jain", "email": "kavita.jain@agent.com", "phone": "9876543216"},
        {"name": "Rohit Gupta", "email": "rohit.gupta@agent.com", "phone": "9876543217"},
        {"name": "Meera Reddy", "email": "meera.reddy@agent.com", "phone": "9876543218"},
        {"name": "Suresh Nair", "email": "suresh.nair@agent.com", "phone": "9876543219"}
    ]

    agents = []
    for i, agent_data in enumerate(agents_data):
        agent = Agent.objects.create(
            name=agent_data["name"],
            email=agent_data["email"],
            phone_number=agent_data["phone"],
            referral_code=f"REF{1000 + i}",
            commission_percentage=5.0 + (i * 0.5)  # 5.0%, 5.5%, 6.0%, etc.
        )
        agents.append(agent)
    return agents

def create_customers():
    """Create customers with specified names"""
    print("Creating customers...")
    customers_data = [
        {"name": "Anand C", "email": "anandc@gmail.com", "phone": "9876543215", "password": "customeranand@123"},
        {"name": "Aditya S", "email": "adityas@gmail.com", "phone": "9876543216", "password": "customeraditya@123"},
        {"name": "Kalyani Pande", "email": "kalyanipande@gmail.com", "phone": "9876543217", "password": "customerkalyani@123"}
    ]

    customers = []
    for customer_data in customers_data:
        customer = Customer.objects.create(
            name=customer_data["name"],
            email=customer_data["email"],
            phone_number=customer_data["phone"]
        )
        customer.set_password(customer_data["password"])
        customer.save()
        customers.append(customer)
    return customers

def create_insurance_companies():
    """Create insurance companies"""
    print("Creating insurance companies...")
    companies_data = [
        {"name": "LifeGuard Insurance", "address": "Mumbai, Maharashtra", "contact": "1800-123-4567"},
        {"name": "HealthPlus Insurance", "address": "Delhi, NCR", "contact": "1800-234-5678"},
        {"name": "SecureLife Insurance", "address": "Bangalore, Karnataka", "contact": "1800-345-6789"}
    ]

    companies = []
    for company_data in companies_data:
        company = InsuranceCompany.objects.create(
            name=company_data["name"],
            contact_info=company_data["contact"],
            address=company_data["address"],
            website=f"https://www.{company_data['name'].lower().replace(' ', '')}.com"
        )
        companies.append(company)
    return companies

def create_insurance_types():
    """Create insurance types"""
    print("Creating insurance types...")
    types_data = [
        {"name": "Life Insurance", "description": "Protection for your family's future"},
        {"name": "Health Insurance", "description": "Medical coverage for health expenses"},
        {"name": "Vehicle Insurance", "description": "Coverage for your vehicle"},
        {"name": "Property Insurance", "description": "Protection for your property"}
    ]

    types = []
    for type_data in types_data:
        insurance_type = InsuranceType.objects.create(
            type_name=type_data["name"],
            description=type_data["description"]
        )
        types.append(insurance_type)
    return types

def create_plans():
    """Create insurance plans - using Policy model"""
    print("Creating insurance plans...")
    companies = list(InsuranceCompany.objects.all())
    types = list(InsuranceType.objects.all())

    plans_data = [
        {"name": "Basic Life Plan", "coverage": 500000, "premium": 1500, "type": types[0], "company": companies[0]},
        {"name": "Premium Life Plan", "coverage": 1000000, "premium": 2500, "type": types[0], "company": companies[0]},
        {"name": "Family Health Plan", "coverage": 300000, "premium": 1200, "type": types[1], "company": companies[1]},
        {"name": "Comprehensive Health", "coverage": 500000, "premium": 2000, "type": types[1], "company": companies[1]},
        {"name": "Two Wheeler Insurance", "coverage": 100000, "premium": 800, "type": types[2], "company": companies[2]},
        {"name": "Four Wheeler Insurance", "coverage": 500000, "premium": 3500, "type": types[2], "company": companies[2]},
        {"name": "Home Insurance", "coverage": 1000000, "premium": 1800, "type": types[3], "company": companies[2]}
    ]

    plans = []
    for plan_data in plans_data:
        plan = Policy.objects.create(
            policy_name=plan_data["name"],
            policy_details=f"Comprehensive {plan_data['name']} coverage",
            coverage=plan_data["coverage"],
            premium_amount=plan_data["premium"],
            insurance_type=plan_data["type"],
            insurance_company=plan_data["company"]
        )
        plans.append(plan)
    return plans

def create_policies():
    """Create 15 policies of all types"""
    print("Creating 15 policies...")
    companies = list(InsuranceCompany.objects.all())
    types = list(InsuranceType.objects.all())

    policies_data = [
        # Life Insurance (5 policies)
        {"name": "Basic Life Plan", "coverage": 500000, "premium": 1500, "type": types[0], "company": companies[0]},
        {"name": "Premium Life Plan", "coverage": 1000000, "premium": 2500, "type": types[0], "company": companies[0]},
        {"name": "Family Life Plan", "coverage": 750000, "premium": 2000, "type": types[0], "company": companies[1]},
        {"name": "Senior Life Plan", "coverage": 300000, "premium": 1200, "type": types[0], "company": companies[1]},
        {"name": "Term Life Plan", "coverage": 2000000, "premium": 1800, "type": types[0], "company": companies[2]},

        # Health Insurance (4 policies)
        {"name": "Family Health Plan", "coverage": 300000, "premium": 1200, "type": types[1], "company": companies[1]},
        {"name": "Comprehensive Health", "coverage": 500000, "premium": 2000, "type": types[1], "company": companies[1]},
        {"name": "Individual Health Plan", "coverage": 200000, "premium": 800, "type": types[1], "company": companies[0]},
        {"name": "Senior Health Plan", "coverage": 400000, "premium": 1600, "type": types[1], "company": companies[2]},

        # Vehicle Insurance (3 policies)
        {"name": "Two Wheeler Insurance", "coverage": 100000, "premium": 800, "type": types[2], "company": companies[2]},
        {"name": "Four Wheeler Insurance", "coverage": 500000, "premium": 3500, "type": types[2], "company": companies[2]},
        {"name": "Commercial Vehicle Insurance", "coverage": 1000000, "premium": 5000, "type": types[2], "company": companies[0]},

        # Property Insurance (3 policies)
        {"name": "Home Insurance", "coverage": 1000000, "premium": 1800, "type": types[3], "company": companies[2]},
        {"name": "Apartment Insurance", "coverage": 1500000, "premium": 2200, "type": types[3], "company": companies[1]},
        {"name": "Office Insurance", "coverage": 2000000, "premium": 3000, "type": types[3], "company": companies[0]}
    ]

    policies = []
    for i, policy_data in enumerate(policies_data):
        policy = Policy.objects.create(
            policy_name=policy_data["name"],
            policy_details=f"Comprehensive {policy_data['name']} coverage with ₹{policy_data['coverage']:,} coverage amount.",
            coverage=policy_data["coverage"],
            premium_amount=policy_data["premium"],
            insurance_type=policy_data["type"],
            insurance_company=policy_data["company"]
        )
        policies.append(policy)
    return policies

def create_customer_policies():
    """Create exactly 10 customer policies"""
    print("Creating 10 customer policies...")
    customers = list(Customer.objects.all())
    policies = list(Policy.objects.all())
    agents = list(Agent.objects.all())

    customer_policies = []
    # Create exactly 10 customer policies
    for i in range(10):
        customer = customers[i % len(customers)]
        policy = policies[i % len(policies)]
        agent = agents[i % len(agents)]

        # Random dates within the last year
        subscription_date = datetime.now() - timedelta(days=random.randint(1, 365))
        expiry_date = subscription_date + timedelta(days=365)

        customer_policy = CustomerPolicy.objects.create(
            customer=customer,
            policy=policy,
            agent=agent,
            subscription_date=subscription_date,
            expiry_date=expiry_date,
            premium_amount_paid=policy.premium_amount,
            status="active"
        )
        customer_policies.append(customer_policy)
    return customer_policies

def create_claims():
    """Create exactly 10 claims for customers"""
    print("Creating 10 claims...")
    customers = list(Customer.objects.all())
    customer_policies = list(CustomerPolicy.objects.all())

    claim_types = ["health", "life", "motor", "home", "property"]
    statuses = ["pending", "approved", "rejected", "paid"]

    claims = []
    # Create exactly 10 claims
    for i in range(10):
        customer = customers[i % len(customers)]
        customer_claim_policies = [cp for cp in customer_policies if cp.customer == customer]
        if customer_claim_policies:
            policy = random.choice(customer_claim_policies)

            claim_amount = random.randint(10000, 50000)
            approved_amount = claim_amount if random.random() > 0.3 else random.randint(5000, claim_amount)

            # Random incident date within last 90 days
            incident_date = datetime.now().date() - timedelta(days=random.randint(1, 90))

            claim = Claim.objects.create(
                customer=customer,
                customer_policy=policy,
                claim_type=random.choice(claim_types),
                incident_date=incident_date,
                claim_amount=claim_amount,
                approved_amount=approved_amount if random.random() > 0.2 else None,
                incident_location=f"Location for {random.choice(['Mumbai', 'Delhi', 'Bangalore', 'Chennai'])}",
                description=f"Claim for {random.choice(claim_types)} incident",
                status=random.choice(statuses)
            )
            claims.append(claim)
    return claims

def create_support_tickets():
    """Create exactly 5 support tickets"""
    print("Creating 5 support tickets...")
    customers = list(Customer.objects.all())

    ticket_subjects = ["policy", "claims", "billing", "technical", "account"]
    priorities = ["low", "medium", "high"]

    tickets = []
    # Create exactly 5 support tickets
    for i in range(5):
        customer = customers[i % len(customers)]

        # Split customer name for first_name and last_name
        name_parts = customer.name.split()
        first_name = name_parts[0] if name_parts else "Unknown"
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        ticket = SupportTicket.objects.create(
            customer=customer,
            subject=ticket_subjects[i % len(ticket_subjects)],
            priority=priorities[i % len(priorities)],
            status=["open", "in_progress", "resolved"][i % 3],
            first_name=first_name,
            last_name=last_name,
            email=customer.email,
            phone=customer.phone_number,
            message=f"Detailed message for {ticket_subjects[i % len(ticket_subjects)]} support request - Ticket #{i+1}"
        )
        tickets.append(ticket)
    return tickets

def generate_credentials_file():
    """Generate a text file with all credentials"""
    print("Generating credentials file...")

    credentials = []

    # Admin credentials
    admin = User.objects.filter(email="admin@gmail.com").first()
    if admin:
        credentials.append("=== ADMIN USER ===")
        credentials.append(f"Email: {admin.email}")
        credentials.append(f"Password: Admin")
        credentials.append(f"Phone: {admin.phone}")
        credentials.append("")

    # Agent credentials
    agents = Agent.objects.all()
    if agents:
        credentials.append("=== AGENTS ===")
        for agent in agents:
            credentials.append(f"Name: {agent.name}")
            credentials.append(f"Email: {agent.email}")
            credentials.append(f"Phone: {agent.phone_number}")
            credentials.append("")

    # Customer credentials
    customers = Customer.objects.all()
    if customers:
        credentials.append("=== CUSTOMERS ===")
        for customer in customers:
            password = "customer" + customer.name.split()[0].lower() + "@123"
            credentials.append(f"Name: {customer.name}")
            credentials.append(f"Email: {customer.email}")
            credentials.append(f"Password: {password}")
            credentials.append(f"Phone: {customer.phone_number}")
            credentials.append("")

    # Write to file
    file_path = "/home/anand/Work/Policy-Bridge/credentials.txt"
    with open(file_path, 'w') as f:
        f.write("\n".join(credentials))

    print(f"Credentials saved to: {file_path}")
    return file_path

def main():
    """Main function to populate all data"""
    print("Starting database population...")

    # Clear all data
    clear_all_data()

    # Create data in order
    admin = create_admin_user()
    agents = create_agents()
    customers = create_customers()
    companies = create_insurance_companies()
    types = create_insurance_types()
    plans = create_plans()
    policies = create_policies()
    customer_policies = create_customer_policies()
    claims = create_claims()
    tickets = create_support_tickets()

    # Generate credentials file
    credentials_file = generate_credentials_file()

    print("\n=== DATABASE POPULATION COMPLETE ===")
    print(f"Admin User: 1")
    print(f"Agents: {len(agents)}")
    print(f"Customers: {len(customers)}")
    print(f"Insurance Companies: {len(companies)}")
    print(f"Insurance Types: {len(types)}")
    print(f"Plans: {len(plans)}")
    print(f"Policies: {len(policies)}")
    print(f"Customer Policies: {len(customer_policies)}")
    print(f"Claims: {len(claims)}")
    print(f"Support Tickets: {len(tickets)}")
    print(f"\nCredentials saved to: {credentials_file}")

if __name__ == "__main__":
    main()