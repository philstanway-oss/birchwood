#!/usr/bin/env python3
"""
Backend API Testing for Birchwood Camping & Fishing
Tests all API endpoints to verify functionality and data integrity
"""

import requests
import json
import sys
from typing import Dict, Any

# Get backend URL from frontend .env
BACKEND_URL = "https://birch-mobile.preview.emergentagent.com/api"

class APITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.results = []
        
    def test_endpoint(self, endpoint: str, expected_fields: list = None) -> Dict[str, Any]:
        """Test a single API endpoint"""
        url = f"{self.base_url}{endpoint}"
        print(f"\n🔍 Testing: {url}")
        
        try:
            response = requests.get(url, timeout=10)
            
            result = {
                "endpoint": endpoint,
                "url": url,
                "status_code": response.status_code,
                "success": response.status_code == 200,
                "response_time": response.elapsed.total_seconds(),
                "error": None,
                "data": None,
                "validation": {"passed": True, "issues": []}
            }
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    result["data"] = data
                    
                    # Validate expected fields if provided
                    if expected_fields:
                        for field in expected_fields:
                            if field not in data:
                                result["validation"]["passed"] = False
                                result["validation"]["issues"].append(f"Missing field: {field}")
                    
                    print(f"✅ SUCCESS - Status: {response.status_code}, Time: {result['response_time']:.2f}s")
                    if data:
                        print(f"📊 Data keys: {list(data.keys()) if isinstance(data, dict) else f'Array with {len(data)} items'}")
                        
                except json.JSONDecodeError as e:
                    result["error"] = f"Invalid JSON response: {str(e)}"
                    result["success"] = False
                    print(f"❌ JSON Error: {result['error']}")
                    
            else:
                result["error"] = f"HTTP {response.status_code}: {response.text}"
                result["success"] = False
                print(f"❌ FAILED - Status: {response.status_code}")
                print(f"   Error: {response.text}")
                
        except requests.exceptions.RequestException as e:
            result = {
                "endpoint": endpoint,
                "url": url,
                "status_code": None,
                "success": False,
                "response_time": None,
                "error": f"Request failed: {str(e)}",
                "data": None,
                "validation": {"passed": False, "issues": [f"Request error: {str(e)}"]}
            }
            print(f"❌ REQUEST ERROR: {result['error']}")
            
        self.results.append(result)
        return result
    
    def run_all_tests(self):
        """Run all API endpoint tests"""
        print("🚀 Starting Birchwood Camping & Fishing API Tests")
        print(f"🌐 Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test 1: Root endpoint
        self.test_endpoint("/", ["message"])
        
        # Test 2: Camping information
        self.test_endpoint("/camping", ["title", "description", "facilities", "pitchTypes", "pricing"])
        
        # Test 3: Fishing information  
        self.test_endpoint("/fishing", ["title", "description", "species", "dayTicketPrice", "rules"])
        
        # Test 4: Contact information
        self.test_endpoint("/contact", ["phone", "email", "address", "latitude", "longitude"])
        
        # Test 5: Site rules
        self.test_endpoint("/rules")
        
        # Test 6: Gallery images
        self.test_endpoint("/gallery")
        
        return self.results
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"  • {result['endpoint']}: {result['error']}")
                    
        print("\n📊 DETAILED RESULTS:")
        for result in self.results:
            status = "✅ PASS" if result["success"] else "❌ FAIL"
            print(f"  {result['endpoint']}: {status}")
            
            if result["success"] and result["data"]:
                if isinstance(result["data"], dict):
                    print(f"    Data: {list(result['data'].keys())}")
                elif isinstance(result["data"], list):
                    print(f"    Data: Array with {len(result['data'])} items")
                    
            if not result["validation"]["passed"]:
                for issue in result["validation"]["issues"]:
                    print(f"    ⚠️  {issue}")
                    
        return passed_tests == total_tests

def main():
    """Main test execution"""
    tester = APITester(BACKEND_URL)
    
    try:
        results = tester.run_all_tests()
        all_passed = tester.print_summary()
        
        # Save results to file for analysis
        with open("/app/test_results_backend.json", "w") as f:
            json.dump(results, f, indent=2, default=str)
            
        print(f"\n💾 Results saved to: /app/test_results_backend.json")
        
        # Exit with appropriate code
        sys.exit(0 if all_passed else 1)
        
    except Exception as e:
        print(f"\n💥 CRITICAL ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()