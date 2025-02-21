# Define API base URL
$baseUrl = "http://localhost:8000/api"

# 1. Create a new user
$userData = @{
    "username" = "diya"
    "email" = "diya@example.com"
    "password" = "diya12345"
    "password2" = "diya12345"
} | ConvertTo-Json -Compress

Write-Host "Creating new user..."
try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/users/register/" `
        -Method Post -Body $userData `
        -ContentType "application/json"
    Write-Host "User registered successfully!"
}
catch {
    Write-Host "Error in Step 1 (User Registration): $($_.Exception.Message)"
    Write-Host "Response: $($_.ErrorDetails.Message)"
    Write-Host "Continuing with login attempt..."
}

# 2. Get authentication token
$loginData = @{
    "username" = "diya"
    "password" = "diya12345"
} | ConvertTo-Json -Compress

Write-Host "`nGetting authentication token..."
try {
    $tokenResponse = Invoke-RestMethod -Uri "$baseUrl/token/" `
        -Method Post -Body $loginData `
        -ContentType "application/json"
    $token = $tokenResponse.access
    Write-Host "Token obtained successfully!"
}
catch {
    Write-Host "Error in Step 2 (Authentication): $($_.Exception.Message)"
    exit
}

# Set up headers for authenticated requests
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Create a forum post
$postData = @{
    "title" = "Test Post by diya123"
    "content" = "check 21/02/25"
} | ConvertTo-Json -Compress

Write-Host "Creating forum post..."
try {
    $postResponse = Invoke-RestMethod -Uri "$baseUrl/forum/posts/" `
        -Headers $headers -Method Post `
        -Body $postData
    $postId = $postResponse.id
    Write-Host "Forum post created with ID: $postId"
}
catch {
    Write-Host "Error in Step 3 (Forum Post Creation): $($_.Exception.Message)"
    exit
}

# 4. Create a comment on the post
$commentData = @{
    "post" = $postId
    "content" = "This is a test comment by jay123"
} | ConvertTo-Json -Compress

Write-Host "`nCreating comment..."
try {
    $commentResponse = Invoke-RestMethod -Uri "$baseUrl/forum/comments/" `
        -Headers $headers -Method Post `
        -Body $commentData
    Write-Host "Comment created successfully!"
}
catch {
    Write-Host "Error in Step 4 (Comment Creation): $($_.Exception.Message)"
}

# 5. Verify created post
Write-Host "`nVerifying created post..."
try {
    $postCheck = Invoke-RestMethod -Uri "$baseUrl/forum/posts/$postId/" `
        -Headers $headers -Method Get
    Write-Host "Post verified successfully:"
    Write-Host "Title: $($postCheck.title)"
    Write-Host "Content: $($postCheck.content)"
}
catch {
    Write-Host "Error in Step 5 (Post Verification): $($_.Exception.Message)"
}

# 6. Verify comments
Write-Host "`nVerifying comments..."
try {
    $commentsCheck = Invoke-RestMethod -Uri "$baseUrl/forum/comments/" `
        -Headers $headers -Method Get
    Write-Host "Comments retrieved successfully:"
    Write-Host "Number of comments: $($commentsCheck.count)"
}
catch {
    Write-Host "Error in Step 6 (Comments Verification): $($_.Exception.Message)"
}

Write-Host "`nScript execution completed!"
