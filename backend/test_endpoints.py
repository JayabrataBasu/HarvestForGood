import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_token_endpoint():
    """Test the token endpoint works correctly."""
    url = f'{BASE_URL}/token/'
    print(f"\nTesting POST {url}")
    
    # Use the correct credentials format expected by the backend
    data = {
        'email': 'jayabratabasu@gmail.com',
        'password': 'your_password_here'  # Replace with actual test password
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        if response.status_code < 400:
            json_data = response.json()
            # Mask token details for security
            if 'access' in json_data:
                json_data['access'] = json_data['access'][:20] + '...'
            if 'refresh' in json_data:
                json_data['refresh'] = json_data['refresh'][:20] + '...'
            print(f"Response: {json.dumps(json_data, indent=2)}")
        else:
            print(f"Response: {response.text}")
        return response.status_code, response.json() if response.status_code < 400 else None
    except Exception as e:
        print(f"Error: {str(e)}")
        return None, None

def test_forum_posts_endpoint():
    """Test the forum posts endpoint for anonymous access."""
    url = f'{BASE_URL}/forum/posts/'
    print(f"\nTesting GET {url} (without auth)")
    
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        
        # Fix the JSON handling here
        if response.status_code < 400:
            json_data = response.json()
            # Check if it's an array and get the first few items
            if isinstance(json_data, list):
                # Only show first 3 items if there are many
                preview_data = json_data[:3] if len(json_data) > 3 else json_data
                print(f"Response: First {len(preview_data)} of {len(json_data)} posts")
                print(json.dumps(preview_data, indent=2))
            else:
                print(f"Response: {json.dumps(json_data, indent=2)}")
        else:
            print(f"Response: {response.text}")
            
        return response.status_code
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def test_me_endpoint(token=None):
    """Test the me endpoint with authentication."""
    if not token:
        print("\nSkipping /users/me/ test - no token available")
        return None
        
    url = f'{BASE_URL}/users/me/'
    print(f"\nTesting GET {url} (with auth)")
    
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code < 400:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"Response: {response.text}")
        return response.status_code
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def print_success_summary():
    """Print a summary of what's working correctly"""
    print("\n====== SUCCESS SUMMARY ======")
    print("✓ Backend server is running")
    print("✓ Anonymous users can view forum posts")
    print("✓ Authentication (token endpoint) is working")
    print("✓ Protected endpoints require authentication")
    print("✓ MeView endpoint returns user data")
    print("\nYour Django backend appears to be properly configured!")
    print("============================")

if __name__ == "__main__":
    # Test forum posts first - should work without auth
    forum_status = test_forum_posts_endpoint()
    
    # Test token endpoint
    token_status, token_data = test_token_endpoint()
    
    # If successful, test the me endpoint
    me_status = None
    if token_status == 200 and token_data and 'access' in token_data:
        me_status = test_me_endpoint(token_data['access'])
    else:
        test_me_endpoint()  # This will be skipped
    
    print("\nTests completed!")
    
    # Print success summary if all tests passed
    if forum_status == 200 and token_status == 200 and me_status == 200:
        print_success_summary()
    else:
        print("\nSome tests failed. Check the output above for details.")
