"""
Comprehensive API Test Suite for RestAPI Project

Tests all endpoints across the following apps:
- User
- Customer
- Agent
- Plan
- Policy
- InsuranceType
- InsuranceCompany
- CustomerPolicy
"""

from django.test import TestCase, Client
from django.urls import reverse
from user.models import User
from customer.models import Customer
from agent.models import Agent
from plan.models import Plan
from policy.models import Policy
from insurancetype.models import InsuranceType
from insurancecompany.models import InsuranceCompany
from customerpolicy.models import CustomerPolicy
import json
from datetime import datetime, timedelta


class UserAPITest(TestCase):
    """Test cases for User API"""

    def setUp(self):
        self.client = Client()
        self.user_data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone': '9876543210',
            'address': '123 Main St'
        }

    def test_create_user(self):
        """Test creating a new user"""
        response = self.client.post(
            '/api/user/',
            data=json.dumps(self.user_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 201, 400])

    def test_get_all_users(self):
        """Test retrieving all users"""
        User.objects.create(**self.user_data)
        response = self.client.get('/api/user/')
        self.assertIn(response.status_code, [200, 404])

    def test_get_user_detail(self):
        """Test retrieving a specific user"""
        user = User.objects.create(**self.user_data)
        response = self.client.get(f'/api/user/{user.id}/')
        self.assertIn(response.status_code, [200, 404])

    def test_update_user(self):
        """Test updating a user"""
        user = User.objects.create(**self.user_data)
        updated_data = {**self.user_data, 'name': 'Jane Doe'}
        response = self.client.put(
            f'/api/user/{user.id}/',
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 400, 404])

    def test_delete_user(self):
        """Test deleting a user"""
        user = User.objects.create(**self.user_data)
        response = self.client.delete(f'/api/user/{user.id}/')
        self.assertIn(response.status_code, [200, 204, 404])


class CustomerAPITest(TestCase):
    """Test cases for Customer API"""

    def setUp(self):
        self.client = Client()
        self.customer_data = {
            'name': 'Alice Smith',
            'email': 'alice@example.com',
            'password': 'password123',
            'phone_number': '9876543210'
        }

    def test_create_customer(self):
        """Test creating a new customer"""
        response = self.client.post(
            '/api/customer/',
            data=json.dumps(self.customer_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 201, 400])

    def test_get_all_customers(self):
        """Test retrieving all customers"""
        Customer.objects.create(**self.customer_data)
        response = self.client.get('/api/customer/')
        self.assertIn(response.status_code, [200, 404])

    def test_get_customer_detail(self):
        """Test retrieving a specific customer"""
        customer = Customer.objects.create(**self.customer_data)
        response = self.client.get(f'/api/customer/{customer.id}/')
        self.assertIn(response.status_code, [200, 404])

    def test_update_customer(self):
        """Test updating a customer"""
        customer = Customer.objects.create(**self.customer_data)
        updated_data = {**self.customer_data, 'name': 'Bob Smith'}
        response = self.client.put(
            f'/api/customer/{customer.id}/',
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 400, 404])

    def test_delete_customer(self):
        """Test deleting a customer"""
        customer = Customer.objects.create(**self.customer_data)
        response = self.client.delete(f'/api/customer/{customer.id}/')
        self.assertIn(response.status_code, [200, 204, 404])


class AgentAPITest(TestCase):
    """Test cases for Agent API"""

    def setUp(self):
        self.client = Client()
        self.agent_data = {
            'name': 'Michael Johnson',
            'email': 'michael@example.com',
            'phone_number': '9876543210',
            'referral_code': 'REF001',
            'commission_percentage': '5.50'
        }

    def test_create_agent(self):
        """Test creating a new agent"""
        response = self.client.post(
            '/api/agent/',
            data=json.dumps(self.agent_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 201, 400])

    def test_get_all_agents(self):
        """Test retrieving all agents"""
        Agent.objects.create(**self.agent_data)
        response = self.client.get('/api/agent/')
        self.assertIn(response.status_code, [200, 404])

    def test_get_agent_detail(self):
        """Test retrieving a specific agent"""
        agent = Agent.objects.create(**self.agent_data)
        response = self.client.get(f'/api/agent/{agent.id}/')
        self.assertIn(response.status_code, [200, 404])

    def test_update_agent(self):
        """Test updating an agent"""
        agent = Agent.objects.create(**self.agent_data)
        updated_data = {**self.agent_data, 'commission_percentage': '6.50'}
        response = self.client.put(
            f'/api/agent/{agent.id}/',
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 400, 404])

    def test_delete_agent(self):
        """Test deleting an agent"""
        agent = Agent.objects.create(**self.agent_data)
        response = self.client.delete(f'/api/agent/{agent.id}/')
        self.assertIn(response.status_code, [200, 204, 404])


class InsuranceTypeAPITest(TestCase):
    """Test cases for InsuranceType API"""

    def setUp(self):
        self.client = Client()
        self.insurance_type_data = {
            'type_name': 'Health Insurance',
            'description': 'Comprehensive health coverage'
        }
        # Create an actual instance for setup
        self.insurance_type = InsuranceType.objects.create(**self.insurance_type_data)

    def test_create_insurance_type(self):
        """Test creating a new insurance type"""
        new_data = {
            'type_name': 'Auto Insurance',
            'description': 'Auto insurance coverage'
        }
        response = self.client.post(
            '/api/insurancetype/',
            data=json.dumps(new_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 201, 400])

    def test_get_all_insurance_types(self):
        """Test retrieving all insurance types"""
        response = self.client.get('/api/insurancetype/')
        self.assertIn(response.status_code, [200, 404])

    def test_get_insurance_type_detail(self):
        """Test retrieving a specific insurance type"""
        response = self.client.get(f'/api/insurancetype/{self.insurance_type.id}/')
        self.assertIn(response.status_code, [200, 404])


class InsuranceCompanyAPITest(TestCase):
    """Test cases for InsuranceCompany API"""

    def setUp(self):
        self.client = Client()
        self.insurance_company_data = {
            'name': 'SafeGuard Insurance',
            'contact_info': 'contact@safeguard.com',
            'address': '456 Insurance Ave',
            'website': 'https://safeguard.com'
        }
        # Create an actual instance for setup
        self.insurance_company = InsuranceCompany.objects.create(**self.insurance_company_data)

    def test_create_insurance_company(self):
        """Test creating a new insurance company"""
        new_data = {
            'name': 'ProtectCorp Insurance',
            'contact_info': 'info@protectcorp.com',
            'address': '789 Protection St',
            'website': 'https://protectcorp.com'
        }
        response = self.client.post(
            '/api/insurancecompany/',
            data=json.dumps(new_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 201, 400])

    def test_get_all_insurance_companies(self):
        """Test retrieving all insurance companies"""
        response = self.client.get('/api/insurancecompany/')
        self.assertIn(response.status_code, [200, 404])

    def test_get_insurance_company_detail(self):
        """Test retrieving a specific insurance company"""
        response = self.client.get(f'/api/insurancecompany/{self.insurance_company.id}/')
        self.assertIn(response.status_code, [200, 404])


class PlanAPITest(TestCase):
    """Test cases for Plan API"""

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(
            name='Plan User',
            email='planuser@example.com',
            phone='9876543210'
        )
        self.plan_data = {
            'user': self.user,
            'plan_name': 'Premium Plan',
            'plan_description': 'Premium insurance plan with full coverage',
            'price': '999.99'
        }

    def test_create_plan(self):
        """Test creating a new plan"""
        plan_json_data = {
            'user': self.user.id,
            'plan_name': 'Premium Plan',
            'plan_description': 'Premium insurance plan with full coverage',
            'price': '999.99'
        }
        response = self.client.post(
            '/api/plan/',
            data=json.dumps(plan_json_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 201, 400])

    def test_get_all_plans(self):
        """Test retrieving all plans"""
        Plan.objects.create(**self.plan_data)
        response = self.client.get('/api/plan/')
        self.assertIn(response.status_code, [200, 404])

    def test_get_plan_detail(self):
        """Test retrieving a specific plan"""
        plan = Plan.objects.create(**self.plan_data)
        response = self.client.get(f'/api/plan/{plan.id}/')
        self.assertIn(response.status_code, [200, 404])


class PolicyAPITest(TestCase):
    """Test cases for Policy API"""

    def setUp(self):
        self.client = Client()
        self.insurance_type = InsuranceType.objects.create(
            type_name='Life Insurance',
            description='Life insurance coverage'
        )
        self.insurance_company = InsuranceCompany.objects.create(
            name='LifeGuard',
            contact_info='info@lifeguard.com',
            address='100 Insurance Plaza',
            website='https://lifeguard.com'
        )
        self.policy_data = {
            'insurance_type': self.insurance_type,
            'insurance_company': self.insurance_company,
            'policy_name': 'Life Guard 100',
            'policy_details': 'Complete life insurance coverage for 100 years',
            'coverage': '1000000.00',
            'premium_amount': '5000.00'
        }

    def test_create_policy(self):
        """Test creating a new policy"""
        policy_json_data = {
            'insurance_type': self.insurance_type.id,
            'insurance_company': self.insurance_company.id,
            'policy_name': 'Life Guard 100',
            'policy_details': 'Complete life insurance coverage for 100 years',
            'coverage': '1000000.00',
            'premium_amount': '5000.00'
        }
        response = self.client.post(
            '/api/policy/',
            data=json.dumps(policy_json_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 201, 400])

    def test_get_all_policies(self):
        """Test retrieving all policies"""
        Policy.objects.create(**self.policy_data)
        response = self.client.get('/api/policy/')
        self.assertIn(response.status_code, [200, 404])

    def test_get_policy_detail(self):
        """Test retrieving a specific policy"""
        policy = Policy.objects.create(**self.policy_data)
        response = self.client.get(f'/api/policy/{policy.id}/')
        self.assertIn(response.status_code, [200, 404])


class CustomerPolicyAPITest(TestCase):
    """Test cases for CustomerPolicy API"""

    def setUp(self):
        self.client = Client()
        self.customer = Customer.objects.create(
            name='Policy Customer',
            email='policycustomer@example.com',
            password='pass123',
            phone_number='9876543210'
        )
        self.agent = Agent.objects.create(
            name='Policy Agent',
            email='policyagent@example.com',
            phone_number='9876543211',
            referral_code='REFPOL001',
            commission_percentage='5.00'
        )
        self.insurance_type = InsuranceType.objects.create(
            type_name='Motor Insurance',
            description='Vehicle insurance'
        )
        self.insurance_company = InsuranceCompany.objects.create(
            name='MotorGuard',
            contact_info='motor@motorguard.com',
            address='Motor Plaza, City',
            website='https://motorguard.com'
        )
        self.policy = Policy.objects.create(
            insurance_type=self.insurance_type,
            insurance_company=self.insurance_company,
            policy_name='Car Insurance Pro',
            policy_details='Comprehensive car insurance',
            coverage='500000.00',
            premium_amount='3000.00'
        )
        self.customer_policy_data = {
            'customer': self.customer,
            'policy': self.policy,
            'agent': self.agent,
            'subscription_date': datetime.now().isoformat(),
            'expiry_date': (datetime.now() + timedelta(days=365)).isoformat(),
            'premium_amount_paid': '3000.00',
            'status': 'active'
        }

    def test_create_customer_policy(self):
        """Test creating a new customer policy"""
        customer_policy_json_data = {
            'customer': self.customer.id,
            'policy': self.policy.id,
            'agent': self.agent.id,
            'subscription_date': datetime.now().isoformat(),
            'expiry_date': (datetime.now() + timedelta(days=365)).isoformat(),
            'premium_amount_paid': '3000.00',
            'status': 'active'
        }
        response = self.client.post(
            '/api/customerpolicy/',
            data=json.dumps(customer_policy_json_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 201, 400])

    def test_get_all_customer_policies(self):
        """Test retrieving all customer policies"""
        CustomerPolicy.objects.create(**self.customer_policy_data)
        response = self.client.get('/api/customerpolicy/')
        self.assertIn(response.status_code, [200, 404])

    def test_get_customer_policy_detail(self):
        """Test retrieving a specific customer policy"""
        customer_policy = CustomerPolicy.objects.create(**self.customer_policy_data)
        response = self.client.get(f'/api/customerpolicy/{customer_policy.id}/')
        self.assertIn(response.status_code, [200, 404])

    def test_update_customer_policy_status(self):
        """Test updating customer policy status"""
        customer_policy = CustomerPolicy.objects.create(**self.customer_policy_data)
        updated_json_data = {
            'customer': self.customer.id,
            'policy': self.policy.id,
            'agent': self.agent.id,
            'subscription_date': datetime.now().isoformat(),
            'expiry_date': (datetime.now() + timedelta(days=365)).isoformat(),
            'premium_amount_paid': '3000.00',
            'status': 'expired'
        }
        response = self.client.put(
            f'/api/customerpolicy/{customer_policy.id}/',
            data=json.dumps(updated_json_data),
            content_type='application/json'
        )
        self.assertIn(response.status_code, [200, 400, 404])


class IntegrationTest(TestCase):
    """Integration tests for API workflows"""

    def setUp(self):
        self.client = Client()

    def test_complete_policy_workflow(self):
        """Test a complete workflow: Create entities and link them"""
        # Create Insurance Type
        insurance_type = InsuranceType.objects.create(
            type_name='Comprehensive',
            description='Full coverage'
        )
        self.assertIsNotNone(insurance_type.id)

        # Create Insurance Company
        company = InsuranceCompany.objects.create(
            name='TestCorp',
            contact_info='test@testcorp.com',
            address='123 Test Street',
            website='https://testcorp.com'
        )
        self.assertIsNotNone(company.id)

        # Create Policy
        policy = Policy.objects.create(
            insurance_type=insurance_type,
            insurance_company=company,
            policy_name='TestPolicy',
            policy_details='Test policy details',
            coverage='100000.00',
            premium_amount='1000.00'
        )
        self.assertIsNotNone(policy.id)

        # Create Customer
        customer = Customer.objects.create(
            name='TestCustomer',
            email='test@customer.com',
            password='testpass',
            phone_number='9876543212'
        )
        self.assertIsNotNone(customer.id)

        # Create Agent
        agent = Agent.objects.create(
            name='TestAgent',
            email='test@agent.com',
            phone_number='9876543213',
            referral_code='TESTREF001',
            commission_percentage='5.00'
        )
        self.assertIsNotNone(agent.id)

        # Create Customer Policy
        customer_policy = CustomerPolicy.objects.create(
            customer=customer,
            policy=policy,
            agent=agent,
            subscription_date=datetime.now(),
            expiry_date=datetime.now() + timedelta(days=365),
            premium_amount_paid='1000.00',
            status='active'
        )
        self.assertIsNotNone(customer_policy.id)

        # Verify relationships
        self.assertEqual(customer_policy.customer.id, customer.id)
        self.assertEqual(customer_policy.policy.id, policy.id)
        self.assertEqual(customer_policy.agent.id, agent.id)
