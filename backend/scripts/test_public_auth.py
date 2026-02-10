import requests
import sys
import uuid

BASE_URL = "http://localhost:8000/api"

def test_public_auth():
    print("Testing Public Auth Flow...")
    
    # Generate unique email
    email = f"user_{uuid.uuid4().hex[:8]}@example.com"
    password = "password123"
    name = "Test User"
    
    print(f"Attempting Signup with {email}...")
    
    # 1. Signup
    try:
        signup_res = requests.post(f"{BASE_URL}/auth/signup", json={
            "email": email,
            "password": password,
            "name": name
        })
        
        if signup_res.status_code != 201:
            print(f"❌ Signup Failed: {signup_res.status_code}")
            print(f"Response: {signup_res.text}")
            return
        
        print(f"✅ Signup Success: {signup_res.json()['id']}")
        
        # 2. Login
        print("Attempting Login...")
        login_res = requests.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": password
        })
        
        if login_res.status_code != 200:
            print(f"❌ Login Failed: {login_res.status_code}")
            print(f"Response: {login_res.text}")
            return
            
        token = login_res.json()["access_token"]
        print("✅ Login Success")
        
        # 3. Get Me
        headers = {"Authorization": f"Bearer {token}"}
        me_res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        
        if me_res.status_code != 200:
             print(f"❌ Get Me Failed: {me_res.status_code}")
        else:
             print(f"✅ Get Me details: {me_res.json()['role']}")

    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_public_auth()
