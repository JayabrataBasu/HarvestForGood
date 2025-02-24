from locust import HttpUser, task, between

class ForumUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def view_posts(self):
        self.client.get("/api/forum/posts/")

    @task
    def create_post(self):
        self.client.post("/api/forum/posts/", json={
            "title": "Test Post",
            "content": "Load testing content"
        }, headers={"Authorization": "Bearer YOUR_TEST_TOKEN"})
