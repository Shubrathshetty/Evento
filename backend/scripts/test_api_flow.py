import requests
import sys

BASE_URL = "http://localhost:8000/api"

def test_api():
    print("Testing API Flow...")
    
    # 1. Login to get token
    try:
        login_res = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "admin@evento.com",
            "password": "admin123"
        })
        if login_res.status_code != 200:
            print(f"❌ Login Failed: {login_res.text}")
            return
        
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ Login Success")

        # 2. Get Events to register for
        events_res = requests.get(f"{BASE_URL}/events", headers=headers)
        events_data = events_res.json()
        if "events" in events_data:
            events = events_data["events"]
        else:
            events = events_data # Fallback if it was a list
            
        if not events:
            print("⚠️ No events found to test registration")
            return
        
        event_id = events[0]["id"]
        print(f"Target Event: {event_id}")

        # 3. Try to register
        # Only try if not registered? API checks.
        reg_res = requests.post(f"{BASE_URL}/events/{event_id}/register", headers=headers)
        
        if reg_res.status_code == 201:
            print("✅ Registration API Success (201)")
        elif reg_res.status_code == 200:
             print("✅ Registration API Success (200)")
        elif reg_res.status_code == 400 and "Already registered" in reg_res.text:
             print("✅ Registration API Success (400 - Already Registered)")
             # Cleanup can be done but this confirms the server processed logic
        else:
             print(f"❌ Registration API Failed: {reg_res.status_code}")
             print(f"Response: {reg_res.text}")

        # 4. Check CORS (via manual OPTIONS request simulation or just noting the above worked)
        # Getting registrations
        my_regs_res = requests.get(f"{BASE_URL}/users/me/registrations", headers=headers)
        if my_regs_res.status_code == 200:
             print("✅ GET My Registrations Success")
        else:
             print(f"❌ GET My Registrations Failed: {my_regs_res.status_code}")

    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_api()
