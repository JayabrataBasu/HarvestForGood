from locust import HttpUser, task, between

class ForumUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def view_posts(self):
        # Test both endpoints
        self.client.get("/api/forum/posts/")  # Singular version
        self.client.get("/api/forums/posts/") # Plural version

    @task
    def create_post(self):
        # Use the singular version as in the frontend
        self.client.post("/api/forum/posts/", json={
            "title": "Test Post",
            "content": "Load testing content"
        }, headers={"Authorization": "Bearer YOUR_TEST_TOKEN"})
