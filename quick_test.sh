#!/bin/bash

# Insurance Management System - Quick Test Checklist
# This script performs quick tests on the system

BACKEND_URL="http://127.0.0.1:8000/api"
FRONTEND_URL="http://localhost:8080"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Insurance Management System - Quick Test Checklist        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Define test results
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    
    echo -n "Testing $name... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [[ $http_code == 200 ]] || [[ $http_code == 201 ]]; then
        echo "✓ PASS (HTTP $http_code)"
        ((TESTS_PASSED++))
    else
        echo "✗ FAIL (HTTP $http_code)"
        ((TESTS_FAILED++))
    fi
}

echo "═══════════════════════════════════════════════════════════"
echo "BACKEND API TESTS"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test Backend Health
test_endpoint "Backend Health" "GET" "$BACKEND_URL/user/"

# Test Login
test_endpoint "Login (Valid)" "POST" "$BACKEND_URL/login/" \
    '{"email":"test@example.com","password":"123456"}'

# Test All Endpoints
test_endpoint "Get Users" "GET" "$BACKEND_URL/user/"
test_endpoint "Get Agents" "GET" "$BACKEND_URL/agent/"
test_endpoint "Get Customers" "GET" "$BACKEND_URL/customer/"
test_endpoint "Get Policies" "GET" "$BACKEND_URL/policy/"
test_endpoint "Get Plans" "GET" "$BACKEND_URL/plan/"
test_endpoint "Get Insurance Companies" "GET" "$BACKEND_URL/insurancecompany/"
test_endpoint "Get Insurance Types" "GET" "$BACKEND_URL/insurancetype/"
test_endpoint "Get Customer Policies" "GET" "$BACKEND_URL/customerpolicy/"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "FRONTEND TESTS"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test Frontend
echo -n "Testing Frontend Access on port 8080... "
if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
    echo "✓ PASS"
    ((TESTS_PASSED++))
else
    echo "✗ FAIL"
    ((TESTS_FAILED++))
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "TEST SUMMARY"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo "✓ ALL TESTS PASSED!"
    echo ""
    echo "System is ready for manual testing:"
    echo "  Backend:  $BACKEND_URL"
    echo "  Frontend: $FRONTEND_URL"
    echo "  Login:    test@example.com / 123456"
    exit 0
else
    echo "✗ SOME TESTS FAILED"
    echo ""
    echo "Please check the errors above and ensure:"
    echo "  1. Backend is running: python manage.py runserver"
    echo "  2. Frontend is running: ng serve --port 8080"
    exit 1
fi
