#!/bin/bash

# Test Configuration
BACKEND_URL="http://127.0.0.1:8000/api"
FRONTEND_URL="http://localhost:8080"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=============================================="
echo "Insurance Management System - Test Suite"
echo "=============================================="
echo ""

# Test 1: Backend Health Check
echo -e "${YELLOW}[TEST 1] Backend Health Check${NC}"
if curl -s "$BACKEND_URL/user/" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend is not accessible${NC}"
    exit 1
fi

# Test 2: Test User Login
echo ""
echo -e "${YELLOW}[TEST 2] User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/login/" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}')

echo "Response: $LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q "Invalid email or password"; then
    echo -e "${YELLOW}Note: test@example.com doesn't exist, creating test user...${NC}"
    # Create a test user
    CREATE_USER=$(curl -s -X POST "$BACKEND_URL/user/" \
      -H "Content-Type: application/json" \
      -d '{"name":"Test User","email":"test@example.com","phone":"9876543210","address":"123 Test St","password":"123456"}')
    echo "User created: $CREATE_USER"
    
    # Try login again
    LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/login/" \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com","password":"123456"}')
    echo "Login response: $LOGIN_RESPONSE"
fi

if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
    echo -e "${GREEN}✓ Login successful${NC}"
    USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
    echo "User ID: $USER_ID"
else
    echo -e "${RED}✗ Login failed${NC}"
fi

# Test 3: Get All Users
echo ""
echo -e "${YELLOW}[TEST 3] Get All Users${NC}"
USERS=$(curl -s -X GET "$BACKEND_URL/user/")
USER_COUNT=$(echo "$USERS" | grep -o '"id"' | wc -l)
if [ $USER_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓ Retrieved $USER_COUNT users${NC}"
else
    echo -e "${RED}✗ Failed to retrieve users${NC}"
fi

# Test 4: Get All Agents
echo ""
echo -e "${YELLOW}[TEST 4] Get All Agents${NC}"
AGENTS=$(curl -s -X GET "$BACKEND_URL/agent/")
AGENT_COUNT=$(echo "$AGENTS" | grep -o '"id"' | wc -l)
if [ $AGENT_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓ Retrieved $AGENT_COUNT agents${NC}"
else
    echo -e "${YELLOW}○ No agents found (this is OK)${NC}"
fi

# Test 5: Get All Customers
echo ""
echo -e "${YELLOW}[TEST 5] Get All Customers${NC}"
CUSTOMERS=$(curl -s -X GET "$BACKEND_URL/customer/")
CUSTOMER_COUNT=$(echo "$CUSTOMERS" | grep -o '"id"' | wc -l)
if [ $CUSTOMER_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓ Retrieved $CUSTOMER_COUNT customers${NC}"
else
    echo -e "${YELLOW}○ No customers found (this is OK)${NC}"
fi

# Test 6: Get All Policies
echo ""
echo -e "${YELLOW}[TEST 6] Get All Policies${NC}"
POLICIES=$(curl -s -X GET "$BACKEND_URL/policy/")
POLICY_COUNT=$(echo "$POLICIES" | grep -o '"id"' | wc -l)
if [ $POLICY_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓ Retrieved $POLICY_COUNT policies${NC}"
else
    echo -e "${YELLOW}○ No policies found (this is OK)${NC}"
fi

# Test 7: Get All Plans
echo ""
echo -e "${YELLOW}[TEST 7] Get All Plans${NC}"
PLANS=$(curl -s -X GET "$BACKEND_URL/plan/")
PLAN_COUNT=$(echo "$PLANS" | grep -o '"id"' | wc -l)
if [ $PLAN_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓ Retrieved $PLAN_COUNT plans${NC}"
else
    echo -e "${YELLOW}○ No plans found (this is OK)${NC}"
fi

# Test 8: Get All Insurance Companies
echo ""
echo -e "${YELLOW}[TEST 8] Get All Insurance Companies${NC}"
COMPANIES=$(curl -s -X GET "$BACKEND_URL/insurancecompany/")
COMPANY_COUNT=$(echo "$COMPANIES" | grep -o '"id"' | wc -l)
if [ $COMPANY_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓ Retrieved $COMPANY_COUNT insurance companies${NC}"
else
    echo -e "${YELLOW}○ No insurance companies found (this is OK)${NC}"
fi

# Test 9: Get All Insurance Types
echo ""
echo -e "${YELLOW}[TEST 9] Get All Insurance Types${NC}"
TYPES=$(curl -s -X GET "$BACKEND_URL/insurancetype/")
TYPE_COUNT=$(echo "$TYPES" | grep -o '"id"' | wc -l)
if [ $TYPE_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓ Retrieved $TYPE_COUNT insurance types${NC}"
else
    echo -e "${YELLOW}○ No insurance types found (this is OK)${NC}"
fi

# Test 10: Get All Customer Policies
echo ""
echo -e "${YELLOW}[TEST 10] Get All Customer Policies${NC}"
CUST_POLICIES=$(curl -s -X GET "$BACKEND_URL/customerpolicy/")
CUST_POLICY_COUNT=$(echo "$CUST_POLICIES" | grep -o '"id"' | wc -l)
if [ $CUST_POLICY_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓ Retrieved $CUST_POLICY_COUNT customer policies${NC}"
else
    echo -e "${YELLOW}○ No customer policies found (this is OK)${NC}"
fi

# Test 11: Frontend Health Check
echo ""
echo -e "${YELLOW}[TEST 11] Frontend Health Check${NC}"
if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is accessible on port 8080${NC}"
    echo -e "${GREEN}  URL: http://localhost:8080${NC}"
else
    echo -e "${YELLOW}○ Frontend not yet fully loaded (still building)${NC}"
fi

echo ""
echo "=============================================="
echo "Test Summary"
echo "=============================================="
echo -e "${GREEN}Backend: http://127.0.0.1:8000/api${NC}"
echo -e "${GREEN}Frontend: http://localhost:8080${NC}"
echo ""
echo -e "${YELLOW}Test Credentials:${NC}"
echo "  Email: test@example.com"
echo "  Password: 123456"
echo ""
echo "=============================================="
