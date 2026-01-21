#!/usr/bin/env python
"""
Test script for Profile Image API
Tests both GET and POST endpoints
"""

import os
import sys
import django
import base64
import json
import requests
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restapi.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from customer.models import Customer

# Test configuration
API_BASE_URL = 'http://localhost:8000/api/customer'
CUSTOMER_ID = 1
TEST_IMAGE_PATH = 'test_image.png'

def create_test_image():
    """Create a simple test PNG image"""
    # Create a minimal 8x8 PNG
    png_data = bytes([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x08,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x4b, 0x6d, 0x81, 0xdc, 0x00, 0x00, 0x00,
        0x1d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0xf8, 0xff, 0xff, 0xff,
        0xbf, 0x00, 0x05, 0xfe, 0x02, 0xfe, 0xa7, 0x35, 0x81, 0x84, 0x00, 0x00,
        0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
    ])
    
    with open(TEST_IMAGE_PATH, 'wb') as f:
        f.write(png_data)
    print(f"✓ Created test image: {TEST_IMAGE_PATH}")
    return TEST_IMAGE_PATH

def get_base64_from_file(file_path):
    """Convert image file to base64"""
    with open(file_path, 'rb') as f:
        image_data = f.read()
    base64_data = base64.b64encode(image_data).decode('utf-8')
    return f"data:image/png;base64,{base64_data}"

def print_header(title):
    """Print test header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def test_get_profile_image():
    """Test GET endpoint - retrieve profile image info"""
    print_header("TEST 1: GET Profile Image (Before Upload)")
    
    url = f"{API_BASE_URL}/{CUSTOMER_ID}/profile-image/"
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, headers={'Content-Type': 'application/json'})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        data = response.json()
        if data.get('profile_image') is None:
            print("✓ No image in database (as expected for new customer)")
            return True
        else:
            print(f"✓ Current image: {data.get('profile_image')}")
            return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_post_profile_image():
    """Test POST endpoint - upload profile image"""
    print_header("TEST 2: POST Profile Image (Upload)")
    
    # Create test image
    create_test_image()
    
    # Convert to base64
    base64_image = get_base64_from_file(TEST_IMAGE_PATH)
    
    url = f"{API_BASE_URL}/{CUSTOMER_ID}/profile-image/"
    payload = {
        "image": base64_image,
        "fileType": "png"
    }
    
    print(f"URL: {url}")
    print(f"Payload size: {len(json.dumps(payload))} bytes")
    print(f"File type: PNG")
    
    try:
        response = requests.post(url, json=payload, headers={'Content-Type': 'application/json'})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✓ Image uploaded successfully")
            return True
        else:
            print(f"✗ Upload failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_get_after_upload():
    """Test GET endpoint - retrieve profile image after upload"""
    print_header("TEST 3: GET Profile Image (After Upload)")
    
    url = f"{API_BASE_URL}/{CUSTOMER_ID}/profile-image/"
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, headers={'Content-Type': 'application/json'})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        data = response.json()
        if data.get('profile_image'):
            print(f"✓ Image successfully stored in database: {data.get('profile_image')}")
            return True
        else:
            print("✗ Image not found in database after upload")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def verify_database():
    """Verify image in database"""
    print_header("TEST 4: Verify Database")
    
    try:
        customer = Customer.objects.get(id=CUSTOMER_ID)
        print(f"Customer ID: {customer.id}")
        print(f"Customer Name: {customer.name}")
        print(f"Customer Email: {customer.email}")
        print(f"Profile Image Field: {customer.profile_image}")
        
        if customer.profile_image:
            print(f"✓ Image verified in database")
            return True
        else:
            print("✗ Image not found in database")
            return False
    except Customer.DoesNotExist:
        print(f"✗ Customer with ID {CUSTOMER_ID} not found")
        return False

def verify_file_exists():
    """Verify image file exists on disk"""
    print_header("TEST 5: Verify File on Disk")
    
    try:
        customer = Customer.objects.get(id=CUSTOMER_ID)
        if not customer.profile_image:
            print("No image in database")
            return False
        
        file_path = os.path.join('media', 'profile_images', customer.profile_image)
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"File path: {file_path}")
            print(f"File size: {file_size} bytes")
            print(f"✓ Image file verified on disk")
            return True
        else:
            print(f"✗ File not found at: {file_path}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def cleanup():
    """Clean up test files"""
    if os.path.exists(TEST_IMAGE_PATH):
        os.remove(TEST_IMAGE_PATH)
        print(f"\nCleaned up: {TEST_IMAGE_PATH}")

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  PROFILE IMAGE API TEST SUITE")
    print("  " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print("="*60)
    
    results = []
    
    # Run tests
    results.append(("GET Profile (Before Upload)", test_get_profile_image()))
    results.append(("POST Profile Image", test_post_profile_image()))
    results.append(("GET Profile (After Upload)", test_get_after_upload()))
    results.append(("Database Verification", verify_database()))
    results.append(("File Existence Check", verify_file_exists()))
    
    # Print summary
    print_header("TEST SUMMARY")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status:8} | {test_name}")
    
    print(f"\n{'='*60}")
    print(f"Results: {passed}/{total} tests passed")
    print(f"{'='*60}\n")
    
    # Cleanup
    cleanup()
    
    return passed == total

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
